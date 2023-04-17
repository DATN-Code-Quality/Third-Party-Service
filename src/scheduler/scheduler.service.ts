import { Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SubmissionResDto } from 'src/submission/res/submission-res.dto';
import { SubmissionDBService } from 'src/submission/submissionDB.service';
import { SubmissionService } from '../submission/submission.service';

@Injectable()
export class SchedulerService {
  private CRON_JOB_NAME = 'cronjob';
  private TIMEOUT_JOB_NAME = 'timeoutjob';
  private INTERVAL = 1; // minutes

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private submissionService: SubmissionService,
    private submissionDBService: SubmissionDBService,
    @Inject('MOODLE_MODULE') private readonly token: string,
  ) {}

  startJob(id: string, moodleId: string, dueTime: number) {
    this.addCronJob(id, moodleId, this.INTERVAL);
    this.addTimeout(moodleId, dueTime - Date.now());
  }

  stopJob(moodleId: string) {
    this.deleteJob(moodleId);
    this.deleteTimeout(moodleId);
  }

  updateJob(id: string, moodleId: string, dueTime: number) {
    this.stopJob(moodleId);
    this.startJob(id, moodleId, dueTime);
  }

  private addCronJob(id: string, moodleId: string, minutes: number) {
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
        Logger.debug(`${name} is running...`);

        // step 1: get all submissions
        let submissions =
          await this.submissionService.getSubmissionsByAssignmentId(moodleId);

        submissions = submissions.map((submission) => ({
          ...submission,
          assignmentId: id,
        }));

        // step 2: filter out old submissions
        // submissions = submissions.filter(
        //   (submission) =>
        //     Number(submission.timemodified) >
        //     new Date().getTime() / 1000 - 60 * minutes,
        // );

        submissions.map(async (submission) => {
          const submissionResDto =
            await this.submissionDBService.findSubmissionWithMoodleId(
              submission.submissionMoodleId,
            );

          Logger.debug(`submissionResDto: ${JSON.stringify(submissionResDto)}`);

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
          ret = { ...ret, link: `${ret.link}?token=${this.token}` };

          Logger.debug(`savedSubmissions: ${JSON.stringify(ret)}`);
          // step 4: send to scanner
          this.submissionService.scanCodes(ret);

          return ret;
        });

        // step 5: send result
      },
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  private addTimeout(assignmentId: string, milliseconds: number) {
    const timeoutJob = this.buildTimeoutName(assignmentId);
    const cronJob = this.buildCronJobName(assignmentId);

    const callback = () => {
      Logger.debug(`${timeoutJob} is stopping...`);
      this.schedulerRegistry.deleteCronJob(cronJob);
      // send notif / assignment stats to teacher
    };

    let timeout = null;

    try {
      timeout = this.schedulerRegistry.getTimeout(timeoutJob);
    } catch (error) {}

    if (timeout) {
      clearTimeout(timeout);
      this.schedulerRegistry.deleteTimeout(timeoutJob);
    }

    timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutJob, timeout);
  }

  private deleteJob(assignmentId: string) {
    const cronJobName = this.buildCronJobName(assignmentId);
    this.schedulerRegistry.deleteCronJob(cronJobName);
  }

  private deleteTimeout(assignmentId: string) {
    const timeoutName = this.buildTimeoutName(assignmentId);
    this.schedulerRegistry.deleteTimeout(timeoutName);
  }

  private buildTimeoutName(assignmentId: string) {
    return `${this.TIMEOUT_JOB_NAME}_${assignmentId}`;
  }

  private buildCronJobName(assignmentId: string) {
    return `${this.CRON_JOB_NAME}_${assignmentId}`;
  }
}
