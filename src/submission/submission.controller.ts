import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  SubmissionResponce,
} from './interfaces/Submission';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}
  @GrpcMethod('SubmissionService', 'GetSubmissionsByAssignmentId')
  async getSubmissionsByAssignmentId(
    data: GetSubmissionsOfAssignmentMoodleIdRequest,
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
