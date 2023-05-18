import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { CourseInfoSchedulerService } from './courseInfoScheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), AssignmentModule],
  controllers: [],
  providers: [CourseInfoSchedulerService],
  exports: [CourseInfoSchedulerService],
})
export class CourseInfoSchedulerModule {}
