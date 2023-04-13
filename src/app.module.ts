import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoodleModule } from './moodle/moodle.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/course.module';
import { CategoryModule } from './courses/category/category.module';
import { AssignmentModule } from './assignment/assignment.module';
import { SubmissionsModule } from './submission/submission.module';
import { IssuesModule } from './sonarqube/issue/issues.module';
import { ProjectModule } from './project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDto } from './project/req/project.dto';
import { SourcesModule } from './sonarqube/source/sources.module';
import { TemporlClientModule } from './temporal/client.module';
import { SubmissionsModule } from './submissions/submission.module';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    CoursesModule,
    CategoryModule,
    SubmissionsModule,
    AssignmentModule,
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
      password: '04042001',
      database: 'sonarqube',
      entities: [ProjectDto],

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
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MoodleModule],
  providers: [AppService],
  // exports: [MoodleModule],
})
export class AppModule {}
