import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SubmissionService } from '../submission/submission.service';
import { SubmissionDBService } from 'src/submission/submissionDB.service';
import { SubmissionReqDto } from 'src/submission/req/submission-req.dto';

@Injectable()
export class SchedulerService {
  private CRON_JOB_NAME = 'cronjob';
  private TIMEOUT_JOB_NAME = 'timeoutjob';
  private INTERVAL = 1; // minutes

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private submissionService: SubmissionService,
    private submissionDBService: SubmissionDBService,
  ) {}

  startJob(assignmentId: string, dueTime: number) {
    this.addCronJob(assignmentId, this.INTERVAL);
    this.addTimeout(assignmentId, dueTime - Date.now());
  }

  stopJob(assignmentId: string) {
    this.deleteJob(assignmentId);
    this.deleteTimeout(assignmentId);
  }

  updateJob(assignmentId: string, dueTime: number) {
    this.stopJob(assignmentId);
    this.startJob(assignmentId, dueTime);
  }

  private addCronJob(assignmentId: string, minutes: number) {
    const name = this.buildCronJobName(assignmentId);

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
          await this.submissionService.getSubmissionsByAssignmentId(
            assignmentId,
          );

        Logger.debug(`submissions: ${JSON.stringify(submissions)}`);

        // step 2: filter out old submissions
        // submissions = submissions.filter(
        //   (submission) =>
        //     Number(submission.timemodified) >
        //     new Date().getTime() / 1000 - 60 * minutes,
        // );

        // step 3: save to db
        const savedSubmissions = submissions.map(async (submission) => {
          const submissionResDto =
            await this.submissionDBService.findSubmissionWithMoodleId(
              submission.submissionMoodleId,
            );
          if (submissionResDto) {
            return this.submissionDBService.update(
              submissionResDto.data.id,
              submission as any,
            );
          } else {
            return this.submissionDBService.create(
              SubmissionReqDto,
              submission as any,
            );
          }
        });

        // step 4: send to scanner
        savedSubmissions.forEach((submission) => {
          this.submissionService.scanCodes(submission as any);
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

    const timeout = setTimeout(callback, milliseconds);
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
