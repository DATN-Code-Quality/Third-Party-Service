import { Metadata } from 'grpc';
import { SourceRequest, SourceResponse, Sources } from './interface/Source';
import { SourceService } from './source.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('source')
export class SourceController {
  
  constructor(private readonly sourceService: SourceService) {
  }
//   @Get("/")
//   async getSourceCodeByKey(
//     @Query('key')key:string,
  
//   ):Promise<Sources>{
//     console.log(key);
// return await this.sourceService.getSourceCodeByKey(key);
//   }

  @GrpcMethod('SourceService', 'getSourceCodeByKey')
  async getSourceCodeByKey(
    data: SourceRequest,
    meta: Metadata,
  ): Promise<SourceResponse> {
    return{ 
     sources: await this.sourceService.getSourceCodeByKey(data.key),
     error:0

    };
  }

}
