import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SubmissionDBService } from './submissionDB.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { ResultModule } from 'src/sonarqube/result/result.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionReqDto, SubmissionResDto]),
    forwardRef(() => SchedulerModule),
    UsersModule,
    ResultModule,
    forwardRef(() => AssignmentModule),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionDBService],
  exports: [SubmissionService, SubmissionDBService],
})
export class SubmissionModule {}
