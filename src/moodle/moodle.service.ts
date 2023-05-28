import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from 'src/common/operation-result';
import { ConnectMoodleRequest } from './interfaces/moodle';
import { MoodleDBService } from './moodleDB.service';
import { MoodleReqDto } from './req/moodle-req.dto';

@Injectable()
export class MoodleService implements OnModuleInit {
  public token: string;
  public host: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly moodleDBService: MoodleDBService,
  ) {}

  async onModuleInit() {
    const moodleInfo = await this.moodleDBService.getMoodleInfo();

    if (moodleInfo.isOk()) {
      this.token = moodleInfo.data[0].token;
      this.host = moodleInfo.data[0].host;
    }
  }

  async connect({
    password,
    serviceName,
    username,
    host,
  }: ConnectMoodleRequest): Promise<OperationResult<string>> {
    const logger = new Logger('MoodleService');

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${host}/login/token.php`, {
            params: {
              username,
              password,
              service: serviceName,
            },
          })
          .pipe(),
      );

      if (data.error) {
        logger.log('ConnectMoodleRequest', JSON.stringify(data));
        return OperationResult.fail(data.error);
      }

      this.token = data.token;
      this.host = host;

      this.moodleDBService.create(MoodleReqDto, {
        token: this.token,
        host,
      } as any);

      return OperationResult.ok('Connected');
    } catch (error) {
      logger.error('ConnectMoodleRequest', JSON.stringify(error));
      return OperationResult.fail(error);
    }
  }

  async status(): Promise<OperationResult<boolean>> {
    if (this.token && this.host) {
      return OperationResult.ok(true);
    }

    return OperationResult.ok(false);
  }
}
