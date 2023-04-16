import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionModule } from 'src/submission/submission.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), SubmissionModule],
  controllers: [],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
