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
import { IssuesModule } from './sonarqube/issue/issues.module';
import { SourcesModule } from './sonarqube/source/sources.module';
import { SubmissionReqDto } from './submission/req/submission-req.dto';
import { TemporlClientModule } from './temporal/client.module';
import { UsersModule } from './users/users.module';
import { RuleModule } from './sonarqube/rule/rule.module';
import { ResultModule } from './sonarqube/result/result.module';
import { QualityGatesModule } from './sonarqube/quality-gate/qualityGate.module';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    CoursesModule,
    CategoryModule,
    AssignmentModule,
    {
      ...HttpModule.register({
        baseURL: process.env.MOODLE_BASE_URL,
      }),
      global: true,
    },
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'sonarqube',
      password: 'Sonar@123',
      database: 'sonarqube',
      entities: [ProjectDto, SubmissionReqDto],
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
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [MoodleModule],
  // exports: [MoodleModule],
})
export class AppModule {}
