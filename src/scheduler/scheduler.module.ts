import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionModule } from 'src/submission/submission.module';
import { SchedulerService } from './scheduler.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ScheduleModule.forRoot(), SubmissionModule, UsersModule],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
