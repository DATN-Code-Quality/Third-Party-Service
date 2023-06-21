import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionModule } from 'src/submission/submission.module';
import { SchedulerService } from './scheduler.service';
import { UsersModule } from 'src/users/users.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SubmissionModule,
    UsersModule,
    forwardRef(() => AssignmentModule),
  ],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
