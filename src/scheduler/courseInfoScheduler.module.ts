import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { CourseInfoSchedulerService } from './courseInfoScheduler.service';
import { SchedulerModule } from './scheduler.module';

@Module({
  imports: [ScheduleModule.forRoot(), AssignmentModule, SchedulerModule],
  controllers: [],
  providers: [CourseInfoSchedulerService],
  exports: [CourseInfoSchedulerService],
})
export class CourseInfoSchedulerModule {}
