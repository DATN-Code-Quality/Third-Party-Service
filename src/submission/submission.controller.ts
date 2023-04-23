import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  SubmissionResponce,
} from './interfaces/Submission';
import { SubmissionService } from './submission.service';
import { ValidationPipe } from 'src/common/validation.pipe';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}
  @GrpcMethod('GSubmissionService', 'GetSubmissionsByAssignmentId')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getSubmissionsByAssignmentId(
    data: GetSubmissionsOfAssignmentMoodleIdRequest,
    meta: Metadata,
  ): Promise<SubmissionResponce> {
    const submissions = await this.service.getSubmissionsByAssignmentId(
      data.assignmentMoodleId,
    );
    return {
      data: submissions,
      error: 0,
    };
  }
}
