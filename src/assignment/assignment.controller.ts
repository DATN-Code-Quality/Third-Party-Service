import { Metadata } from '@grpc/grpc-js';
import { Controller, Logger, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { AssignmentService } from './assignment.service';
import {
  Assignment,
  AssignmentsCronjobRequest,
  GetAssignmentsOfCourseRequest,
} from './interfaces/Assignment';
import { ValidationPipe } from 'src/common/validation.pipe';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { OperationResult } from 'src/common/operation-result';

@Controller('assignment')
export class AssignmentController {
  constructor(
    private readonly service: AssignmentService,
    private readonly scheduler: SchedulerService,
  ) {}

  @GrpcMethod('GAssignmentService', 'GetAllAssignmentsByCourseId')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getAllAssignmentsByCourseId(
    data: GetAssignmentsOfCourseRequest,
    meta: Metadata,
  ): Promise<OperationResult<Assignment[]>> {
    return this.service.getAllAssignmentsByCourseId(data.courseMoodleId);
  }

  @GrpcMethod('GAssignmentService', 'AddAssignmentCronjob')
  async addAssignmentCronjob(data: AssignmentsCronjobRequest, meta: Metadata) {
    const { assignments } = data;
    assignments.forEach((assignment) => {
      if (
        Number(assignment.assignmentMoodleId) <= 0 ||
        Number(assignment.dueDate) <= 0 ||
        !assignment.id
      ) {
        Logger.error(
          JSON.stringify(assignment),
          'AssignmentController.addAssignmentCronjob',
        );
        return;
      }

      this.scheduler.startJob(
        assignment.id,
        assignment.assignmentMoodleId,
        Number(assignment.dueDate),
      );
    });

    return {};
  }
}
