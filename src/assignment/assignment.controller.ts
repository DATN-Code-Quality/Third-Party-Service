import { Metadata } from '@grpc/grpc-js';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AssignmentService } from './assignment.service';
import {
  AssignmentsCronjobRequest,
  AssignmentsResponce,
  GetAssignmentsOfCourseRequest,
} from './interfaces/Assignment';
import { SchedulerService } from 'src/scheduler/scheduler.service';

@Controller('assignment')
export class AssignmentController {
  constructor(
    private readonly service: AssignmentService,
    private readonly scheduler: SchedulerService,
  ) {}

  @GrpcMethod('AssignmentService', 'GetAllAssignmentsByCourseId')
  async getAllAssignmentsByCourseId(
    data: GetAssignmentsOfCourseRequest,
    meta: Metadata,
  ): Promise<AssignmentsResponce> {
    const assignments = await this.service.getAllAssignmentsByCourseId(
      data.courseMoodleId,
    );
    return {
      assignments,
      error: 0,
    };
  }

  @GrpcMethod('AssignmentService', 'AddAssignmentCronjob')
  async addAssignmentCronjob(data: AssignmentsCronjobRequest, meta: Metadata) {
    Logger.debug('Add cronjob - data: ' + JSON.stringify(data));

    const { assignments } = data;
    assignments.forEach((assignment) => {
      this.scheduler.startJob(
        assignment.assignmentMoodleId,
        Number(assignment.dueDate),
      );
    });

    return {};
  }
}
