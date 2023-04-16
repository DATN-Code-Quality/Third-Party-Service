import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionModule } from 'src/submission/submission.module';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [ScheduleModule.forRoot(), SubmissionModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
