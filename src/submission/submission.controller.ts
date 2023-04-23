import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { ValidationPipe } from 'src/common/validation.pipe';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  Submission,
} from './interfaces/Submission';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}
  @GrpcMethod('GSubmissionService', 'GetSubmissionsByAssignmentId')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getSubmissionsByAssignmentId(
    data: GetSubmissionsOfAssignmentMoodleIdRequest,
    meta: Metadata,
  ): Promise<OperationResult<Submission[]>> {
    return this.service.getSubmissionsByAssignmentId(data.assignmentMoodleId);
  }
}
