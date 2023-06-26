import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from 'src/common/operation-result';
import { ConnectMoodleRequest } from './interfaces/moodle';
import { MoodleDBService } from './moodleDB.service';
import { MoodleReqDto } from './req/moodle-req.dto';

@Injectable()
export class MoodleService implements OnModuleInit {
  public static token: string;
  public static host: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly moodleDBService: MoodleDBService,
  ) {}

  async onModuleInit() {
    const moodleInfo = await this.moodleDBService.getMoodleInfo();

    if (moodleInfo.isOk() && moodleInfo.data.length > 0) {
      MoodleService.token = moodleInfo.data[0].token;
      MoodleService.host = moodleInfo.data[0].host;
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

      MoodleService.token = data.token;
      MoodleService.host = host;

      this.moodleDBService.create(MoodleReqDto, {
        token: data.token,
        host,
      } as any);

      return OperationResult.ok('Connected');
    } catch (error) {
      logger.error('ConnectMoodleRequest', JSON.stringify(error));
      return OperationResult.fail(error);
    }
  }

  async status(): Promise<OperationResult<boolean>> {
    if (MoodleService.token && MoodleService.host) {
      return OperationResult.ok(true);
    }

    return OperationResult.ok(false);
  }
}
