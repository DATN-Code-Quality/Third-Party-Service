import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IssueRequest, IssueResponse } from './interfaces/Issue';
import { Metadata } from '@grpc/grpc-js';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issueService: IssuesService) {}

  @GrpcMethod('GSonarqubeService', 'getIssuesBySubmissionId')
  async getIssuesBySubmissionId(
    data: IssueRequest,
    meta: Metadata,
  ): Promise<IssueResponse> {
    var result: IssueResponse;
    await this.issueService
      .getAllIssuesBySubmissionId(
        data.submissionId,
        data.type,
        data.severity,
        data.rule,
        data.file,
        data.fileuuid,
        data.page,
        data.pageSize,
      )
      .then((issue) => {
        if (issue) {
          result = {
            data: issue,
            error: 0,
            message: null,
          };
        } else {
          result = {
            message: 'No data Found',
            data: null,
            error: 1,
          };
        }
      })
      .catch((e) => {
        result = {
          message: e,
          data: null,
          error: 1,
        };
      });

    return result;
  }
}
