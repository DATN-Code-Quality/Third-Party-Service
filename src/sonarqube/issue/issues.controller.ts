import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IssueRequest, IssueResponse } from './interfaces/Issue';
import { Metadata } from '@grpc/grpc-js';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issueService: IssuesService) {}

  @GrpcMethod('GIssueService', 'getIssuesBySubmissionId')
  async getIssuesBySubmissionId(
    data: IssueRequest,
    meta: Metadata,
  ): Promise<IssueResponse> {
    var result: IssueResponse;
    await this.issueService
      .getIssuesBySubmissionId(
        data.submissionId,
        data.type,
        data.severity,
        data.rule,
        data.file,
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
            message: 'Not find',
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
