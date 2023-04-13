import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SubmissionService } from './submission.service';
import {
  GetAssignmentsOfAssignmentMoodleIdRequest,
  SubmissionResponce,
} from './interfaces/Submission';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}
  @GrpcMethod('SubmissionService', 'GetSubmissionsByAssignmentId')
  async getSubmissionsByAssignmentId(
    data: GetAssignmentsOfAssignmentMoodleIdRequest,
    meta: Metadata,
  ): Promise<SubmissionResponce> {
    const submissions = await this.service.getSubmissionsByAssignmentId(
      data.assignmentMoodleId,
    );
    return {
      submissions,
      error: 0,
    };
  }
}
