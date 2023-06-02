import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignmentModule } from './assignment/assignment.module';
import { AssignmentReqDto } from './assignment/req/assignment-req.dto';
import { CategoryReqDto } from './category/req/category-req.dto';
import { CategoryModule } from './courses/category/category.module';
import { CoursesModule } from './courses/course.module';
import { CourseReqDto } from './courses/req/course-req.dto';
import { LoggerModule } from './logger/logger.module';
import { MoodleModule } from './moodle/moodle.module';
import { MoodleReqDto } from './moodle/req/moodle-req.dto';
import { ProjectModule } from './project/project.module';
import { ProjectReqDto } from './project/req/project-req.dto';
import { IssuesModule } from './sonarqube/issue/issues.module';
import { QualityGatesModule } from './sonarqube/quality-gate/qualityGate.module';
import { ResultModule } from './sonarqube/result/result.module';
import { RuleModule } from './sonarqube/rule/rule.module';
import { SourcesModule } from './sonarqube/source/sources.module';
import { SubmissionReqDto } from './submission/req/submission-req.dto';
import { TemporlClientModule } from './temporal/client.module';
import { UserCourseReqDto } from './user-course/req/user-course-req.dto';
import { UserReqDto } from './users/req/user-req.dto';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    CoursesModule,
    CategoryModule,
    AssignmentModule,
    {
      ...HttpModule.register({}),
      global: true,
    },
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'sonarqube',
      password: 'Sonar@123',
      database: 'sonarqube',
      entities: [
        UserReqDto,
        CategoryReqDto,
        CourseReqDto,
        UserCourseReqDto,
        AssignmentReqDto,
        SubmissionReqDto,
        ProjectReqDto,
        MoodleReqDto,
      ],
      logging: false,
      synchronize: true,
    }),
    IssuesModule,
    ProjectModule,
    SourcesModule,
    RuleModule,
    ResultModule,
    QualityGatesModule,
    TemporlClientModule,
    MoodleModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [MoodleModule],
  // exports: [MoodleModule],
})
export class AppModule {}
