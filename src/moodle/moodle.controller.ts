import { Metadata } from '@grpc/grpc-js';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { MoodleService } from './moodle.service';
import { ConnectMoodleRequest } from './interfaces/moodle';

@Controller('moodle')
export class MoodleController {
  constructor(private readonly service: MoodleService) {}

  @GrpcMethod('GMoodleService', 'ConnectMoodle')
  async connectMoodle(
    data: ConnectMoodleRequest,
    meta: Metadata,
  ): Promise<OperationResult<string>> {
    Logger.debug('ConnectMoodleRequest', JSON.stringify(data));
    return this.service.connect(data);
  }

  @GrpcMethod('GMoodleService', 'IsMoodleConnected')
  async isMoodleConnected(meta: Metadata): Promise<OperationResult<boolean>> {
    Logger.debug('IsMoodleConnected');

    return this.service.status();
  }
}
