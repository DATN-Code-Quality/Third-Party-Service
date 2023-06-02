import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { ResultService } from './result.service';
import { ResultRequest, ResultResponse } from './interfaces/Result';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @GrpcMethod('GSonarqubeService', 'getResultsBySubmissionId')
  async getIssuesBySubmissionId(
    data: ResultRequest,
    meta: Metadata,
  ): Promise<ResultResponse> {
    console.log(data.submissionId, data.page, data.pageSize);

    return await this.resultService
      .getResultsBySubmissionId(data.submissionId, data.page, data.pageSize)
      .then((result) => {
        if (result) {
          return {
            data: result,
            error: 0,
            message: null,
          };
        } else {
          return {
            message: 'No data Found',
            data: null,
            error: 1,
          };
        }
      })
      .catch((e) => {
        return {
          message: e,
          data: null,
          error: 1,
        };
      });
  }
}
