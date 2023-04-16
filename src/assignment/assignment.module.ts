import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
// import { CoursesController } from './course.controller';
// import { CoursesService } from './course.service';

@Module({
  imports: [SchedulerModule],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
