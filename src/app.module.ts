import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoodleModule } from './moodle/moodle.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/course.module';
import { IssuesModule } from './sonarqube/issue/issues.module';

@Module({
  imports: [
    //   MoodleModule,
    //   UsersModule,
    //   CoursesModule,
    //   {
    //     ...HttpModule.register({
    //       baseURL: process.env.MOODLE_BASE_URL,
    //     }),
    //     global: true,
    //   },
    IssuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [MoodleModule],
})
export class AppModule {}
