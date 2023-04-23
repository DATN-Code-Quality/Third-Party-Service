import { HttpService } from '@nestjs/axios';
import { Global, Logger, Module } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { genEndpoint } from 'src/utils';

@Module({
  imports: [],
  providers: [
    {
      provide: 'MOODLE_MODULE',
      useFactory: async (httpService: HttpService): Promise<HttpService> => {
        const logger = new Logger(MoodleModule.name);
        const { data } = await firstValueFrom(
          httpService
            .get(
              genEndpoint('/login/token.php', {
                username: process.env.MOODLE_ACCOUNT_NAME,
                password: process.env.MOODLE_ACCOUNT_PASSWORD,
                service: process.env.MOODLE_SERVICE_NAME,
              }),
            )
            .pipe(),
        );

        return data.token;
      },
      inject: [HttpService],
    },
  ],
  exports: ['MOODLE_MODULE'],
})
@Global()
export class MoodleModule {}
