import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignmentModule } from './assignment/assignment.module';
import { CategoryModule } from './courses/category/category.module';
import { CoursesModule } from './courses/course.module';
import { MoodleModule } from './moodle/moodle.module';
import { ProjectModule } from './project/project.module';
import { ProjectDto } from './project/req/project.dto';
import { SchedulerModule } from './scheduler/scheduler.module';
import { IssuesModule } from './sonarqube/issue/issues.module';
import { SourcesModule } from './sonarqube/source/sources.module';
import { TemporlClientModule } from './temporal/client.module';
import { UsersModule } from './users/users.module';
import { SubmissionReqDto } from './submission/req/submission-req.dto';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    CoursesModule,
    CategoryModule,
    AssignmentModule,
    SchedulerModule,
    {
      ...HttpModule.register({
        baseURL: process.env.MOODLE_BASE_URL,
      }),
      global: true,
    },
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'sonarqube',
      entities: [ProjectDto, SubmissionReqDto],

      logging: 'all',
      synchronize: true,
    }),
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
    ProjectModule,
    SourcesModule,
    TemporlClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MoodleModule],
  // exports: [MoodleModule],
})
export class AppModule {}
