import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IssueRequest, IssueResponse } from './interfaces/Issue';
import { Metadata } from '@grpc/grpc-js';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issueService: IssuesService) {}

  @GrpcMethod('IssueService', 'getIssuesByKey')
  async getIssuesByKey(
    data: IssueRequest,
    meta: Metadata,
  ): Promise<IssueResponse> {
    return {
      issues: await this.issueService.getIssuesByKey(data.key),
      error: 0,
    };
  }
}
