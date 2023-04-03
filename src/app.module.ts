import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoodleModule } from './moodle/moodle.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    {
      ...HttpModule.register({
        baseURL: process.env.MOODLE_BASE_URL,
      }),
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: HttpService,
    //   useFactory: (token: string) => {
    //     console.log({ token });
    //   },
    //   inject: [{ token: 'MOODLE_MODULE', optional: false }],
    // },
  ],
  exports: [MoodleModule],
})
export class AppModule {}
