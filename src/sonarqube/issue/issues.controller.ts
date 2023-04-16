import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IssueRequest, IssueResponse } from './interfaces/Issue';
import { Metadata } from '@grpc/grpc-js';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issueService: IssuesService) {}

  @GrpcMethod('IssueService', 'getIssuesBySubmissionId')
  async getIssuesBySubmissionId(
    data: IssueRequest,
    meta: Metadata,
  ): Promise<IssueResponse> {
    const result = await this.issueService.getIssuesBySubmissionId(
      data.submissionId,
      data.type,
      data.page,
      data.pageSize,
    );

    if (result == null) {
      return {
        issues: null,
        error: 1,
      };
    }
    return {
      issues: result,
      error: 0,
    };
  }
}
