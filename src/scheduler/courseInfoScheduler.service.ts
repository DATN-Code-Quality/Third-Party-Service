import { Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AssignmentService } from 'src/assignment/assignment.service';
import { AssignmentDBService } from 'src/assignment/assignmentDB.service';
import { AssignmentReqDto } from 'src/assignment/req/assignment-req.dto';
import { SchedulerService } from './scheduler.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { OperationResult } from 'src/common/operation-result';

@Injectable()
export class CourseInfoSchedulerService {
  private CRON_JOB_NAME = 'course_info_cronjob';
  private INTERVAL = 1; // minutes

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private assigmentService: AssignmentService,
    private assignmentDBService: AssignmentDBService,
    private submissionScheduler: SchedulerService,
    @Inject('MOODLE_MODULE') private readonly token: string,
  ) {}

  startJob(id: string, moodleId: number, dueTime: number) {
    this.addCronJob(id, moodleId, this.INTERVAL, dueTime);
  }

  stopJob(moodleId: number) {
    this.deleteJob(moodleId);
  }

  updateJob(id: string, moodleId: number, dueTime: number) {
    this.stopJob(moodleId);
    this.startJob(id, moodleId, dueTime);
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
    } catch (error) {}

    Logger.log(`addCronJob: ${name}`, 'CourseInfoSchedulerService');

    // job will run every 'minutes' minutes at a random second (to avoid DDOS on moodle server)
    job = new CronJob(
      `${Math.floor(Math.random() * 60)} */${minutes} * * * *`,
      async () => {
        Logger.log(`${name} is running...`, 'CourseInfoSchedulerService');

        const current = Date.now();

        if (current > dueTime) {
          this.stopJob(moodleId);
          return;
        }

        // step 1: get all assignment
        let result = await this.assigmentService.getAllAssignmentsByCourseId(
          moodleId,
        );

        if (!result.isOk()) {
          Logger.error(
            "Can't get assignments from moodle",
            'CourseInfoSchedulerService.addCronJob',
          );
          return;
        }

        let assignments = result.data;

        Logger.log(`assignments: ${JSON.stringify(assignments)}`);

        assignments = assignments.map((assignment) => ({
          ...assignment,
          assignmentId: id,
        }));

        const assignmentsReqDTO = assignments.map((assignment) => ({
          assignmentMoodleId: assignment.assignmentMoodleId,
          attachmentFileLink: assignment.attachmentFileLink,
          courseId: assignment.courseId,
          dueDate: new Date(
            parseInt(assignment.dueDate as any as string, 10) * 1000, // ép kiểu ở đây là do assignment service gán trực tiếp số từ moodle mà k đổi sang Date
          ),
          name: assignment.name,
          description: assignment.description,
          status: assignment.status,
          config: assignment.config,
        }));

        // step 5: send result
        const savedresult = await this.assignmentDBService.upsertAssignments(
          assignmentsReqDTO as any as AssignmentReqDto[],
        );

        if (savedresult.isOk()) {
          const { data } = savedresult as OperationResult<AssignmentResDto[]>;

          data.forEach((assignment: AssignmentResDto) => {
            this.submissionScheduler.startJob(
              assignment.id,
              Number(assignment.assignmentMoodleId),
              assignment.dueDate.getTime(),
            );
          });
        }
      },
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  private deleteJob(assignmentId: number) {
    const cronJobName = this.buildCronJobName(assignmentId);
    this.schedulerRegistry.deleteCronJob(cronJobName);
  }

  private buildCronJobName(assignmentId: number) {
    return `${this.CRON_JOB_NAME}_${assignmentId}`;
  }
}
