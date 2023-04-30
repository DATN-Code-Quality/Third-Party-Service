import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { SourcesService } from './sources.service';
import { SourceRequest, SourceResponse } from './interfaces/Source';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourceService: SourcesService) {}

  @GrpcMethod('GSourceService', 'getSourcesByKey')
  async getSourcesBySubmissionId(
    data: SourceRequest,
    meta: Metadata,
  ): Promise<SourceResponse> {
    var result: SourceResponse;
    await this.sourceService
      .getSourcesByKey(data.key)
      .then((source) => {
        if (source == null) {
          result = {
            message: 'No data Found',
            data: null,
            error: 1,
          };
        }
        result = {
          data: source,
          error: 0,
          message: null,
        };
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
