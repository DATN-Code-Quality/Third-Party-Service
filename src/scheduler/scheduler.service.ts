import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';
import { SubmissionDBService } from 'src/submission/submissionDB.service';
import { UsersDBService } from 'src/users/usersDB.service';
import { SubmissionService } from '../submission/submission.service';
import { MoodleService } from 'src/moodle/moodle.service';
import { User } from 'src/users/interfaces/User';
import * as nodemailer from 'nodemailer';
import { templateSendResultHtml } from 'src/config/templateSendResultHtml';
import { AssignmentDBService } from 'src/assignment/assignmentDB.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { HttpService } from '@nestjs/axios';
import { ResultModule } from 'src/sonarqube/result/result.module';
import { ResultService } from 'src/sonarqube/result/result.service';
import { OperationResult } from 'src/common/operation-result';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SchedulerService {
  private CRON_JOB_NAME = 'cronjob';
  private TIMEOUT_JOB_NAME = 'timeoutjob';
  private INTERVAL = 1; // minutes

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private submissionService: SubmissionService,
    private submissionDBService: SubmissionDBService,
    private usersDBService: UsersDBService,
    private resultService: ResultService,
    @Inject(forwardRef(() => AssignmentDBService))
    private assignmentDBService: AssignmentDBService,
    private readonly httpService: HttpService,
    @Inject('MOODLE_MODULE') private readonly moodle: MoodleService,
  ) {}

  startJob(id: string, moodleId: number, dueTime: number) {
    this.addCronJob(id, moodleId, this.INTERVAL, dueTime);
  }

  stopJob(moodleId: number) {
    this.deleteJob(moodleId);
    this.deleteTimeout(moodleId);
  }

  updateJob(id: string, moodleId: number, dueTime: number) {
    this.stopJob(moodleId);
    this.startJob(id, moodleId, dueTime);
  }

  async sendEmail(user: User, templateHtml: string, subject: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER_ACCOUNT,
        pass: process.env.USER_PASSWORD,
      },
      from: process.env.USER_ACCOUNT,
    });
    const mainOptions = {
      from: `<codequality2023@gmail.com>`,
      to: user.email,
      subject: subject,
      text: 'Hello. This email is for scanning your submission.',
      html: templateHtml,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        Logger.log('Send Email Error: ' + JSON.stringify(err));
      } else {
        Logger.log('Message sent: ' + JSON.stringify(info.response));
      }
    });
  }

  private addCronJob(
    id: string,
    moodleId: number,
    minutes: number,
    dueTime: number,
  ) {
    const name = this.buildCronJobName(moodleId);

    let job = null;

    try {
      job = this.schedulerRegistry.getCronJob(name);
      if (job) {
        this.schedulerRegistry.deleteCronJob(name);
      }
    } catch (error) {
      Logger.error('Error: ' + error);
    }

    // job will run every 'minutes' minutes at a random second (to avoid DDOS on moodle server)
    job = new CronJob(
      `${Math.floor(Math.random() * 60)} */${minutes} * * * *`,
      async () => {
        if (Date.now() > dueTime) {
          this.schedulerRegistry.deleteCronJob(name);
          Logger.log(`Job ${name} is deleted`);
        }

        Logger.debug(`${name} is running...`);

        // step 1: get all submissions
        let result = await this.submissionService.getSubmissionsByAssignmentId(
          moodleId,
        );

        if (!result.isOk()) {
          Logger.error(
            "Can't get submissions from moodle",
            'SchedulerService.addCronJob',
          );
        }

        let submissions = result.data.map((item) => {
          const newItem = { ...item };
          delete newItem.id;
          return newItem;
        });

        submissions = submissions.filter(
          (submission) => submission.link && submission.link !== '',
        );

        // Logger.debug(`submissions: ${JSON.stringify(submissions)}`);

        submissions = submissions.map((submission) => ({
          ...submission,
          assignmentId: id,
        }));

        submissions.map(async (submission) => {
          const findUser = await this.usersDBService.findUserByMoodleId(
            submission.userId,
          );

          if (findUser.isOk()) {
            submission = { ...submission, userId: findUser.data.id };
          } else return;

          const submissionResDto =
            await this.submissionDBService.findSubmissionWithMoodleId(
              submission.submissionMoodleId,
            );

          // đoạn này có nghĩa là submission có trong DB và không có modified thì skip
          const timemodified = new Date(submission.timemodified);
          if (
            submissionResDto.data !== null &&
            Date.now() - timemodified.getTime() > this.INTERVAL * 60 * 1000
          ) {
            return;
          }

          // step 3: save to db
          let ret = null;
          if (submissionResDto.data !== null) {
            await this.submissionDBService.update(
              submissionResDto.data.id,
              submission as any,
            );

            ret = { ...submission, id: submissionResDto.data.id };
          } else {
            const { data } = await this.submissionDBService.create(
              SubmissionResDto,
              submission as any,
            );
            ret = { ...data };
          }

          // add token to url
          ret = {
            ...ret,
            link: `${ret.link}?token=${this.moodle.token}`,
            timemodified: timemodified,
          };

          Logger.debug(`savedSubmissions: ${JSON.stringify(ret)}`);
          // step 4: send to scanner
          await this.submissionService.scanCodes(ret).then(async (rs) => {
            // step 5: send result
            //  const findUser = await this.usersDBService.findOne(

            //     submission.userId,
            //   );
            const findAssignment = await this.assignmentDBService.findOne(
              AssignmentResDto,
              ret.assignmentId,
            );
            const resultOverview =
              await this.resultService.getOverviewResultsBySubmissionId(ret.id);
            const submissionAfterScan = await this.submissionDBService.findOne(
              SubmissionResDto,
              ret.id,
            );

            if (findUser.isOk() && findAssignment.isOk()) {
              await this.sendEmail(
                findUser.data,
                templateSendResultHtml(
                  findUser.data,
                  findAssignment.data.name,
                  submissionAfterScan.data.status,
                  resultOverview,
                ),
                'Your submission result',
              );
              try {
                const { data } = await firstValueFrom(
                  this.httpService
                    .get(`${this.moodle.host}/webservice/rest/server.php`, {
                      params: {
                        wstoken: this.moodle.token,
                        wsfunction: 'core_message_send_instant_messages',
                        moodlewsrestformat: 'json',
                        'messages[0][touserid]': findUser.data.moodleId,
                        'messages[0][text]': `Your submission of assigment ${findAssignment.data.name} has been completed`,
                        'messages[0][textformat]': 0,
                      },
                    })
                    .pipe(),
                );
              } catch (error) {
                Logger.error(error, 'Send Message Error');
                return OperationResult.error(error, []);
              }
            }
          });

          return ret;
        });
      },
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // private addTimeout(assignmentId: number, milliseconds: number) {
  //   const timeoutJob = this.buildTimeoutName(assignmentId);
  //   const cronJob = this.buildCronJobName(assignmentId);

  //   const callback = () => {
  //     Logger.debug(`${timeoutJob} is stopping...`);
  //     this.schedulerRegistry.deleteCronJob(cronJob);
  //     // send notif / assignment stats to teacher
  //   };

  //   let timeout = null;

  //   try {
  //     timeout = this.schedulerRegistry.getTimeout(timeoutJob);
  //   } catch (error) {}

  //   if (timeout) {
  //     clearTimeout(timeout);
  //     this.schedulerRegistry.deleteTimeout(timeoutJob);
  //   }

  //   timeout = setTimeout(callback, milliseconds);
  //   this.schedulerRegistry.addTimeout(timeoutJob, timeout);
  // }

  private deleteJob(assignmentId: number) {
    const cronJobName = this.buildCronJobName(assignmentId);
    this.schedulerRegistry.deleteCronJob(cronJobName);
  }

  private deleteTimeout(assignmentId: number) {
    const timeoutName = this.buildTimeoutName(assignmentId);
    this.schedulerRegistry.deleteTimeout(timeoutName);
  }

  private buildTimeoutName(assignmentId: number) {
    return `${this.TIMEOUT_JOB_NAME}_${assignmentId}`;
  }

  private buildCronJobName(assignmentId: number) {
    return `${this.CRON_JOB_NAME}_${assignmentId}`;
  }
}
