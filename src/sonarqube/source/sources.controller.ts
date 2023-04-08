import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { SourcesService } from './sources.service';
import { SourceRequest, SourceResponse } from './interfaces/Source';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourceService: SourcesService) {}

  @GrpcMethod('SourceService', 'getSourcesByKey')
  async getSourcesBySubmissionId(
    data: SourceRequest,
    meta: Metadata,
  ): Promise<SourceResponse> {
    console.log(data.key);
    const result = await this.sourceService.getSourcesByKey(data.key);

    if (result == null) {
      return {
        sources: null,
        error: 1,
      };
    }
    return {
      sources: result,
      error: 0,
    };
  }
}
