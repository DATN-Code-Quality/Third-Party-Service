import { Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';
import { CourseInfoSchedulerModule } from 'src/scheduler/courseInfoScheduler.module';

@Module({
  imports: [CourseInfoSchedulerModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService]
})
export class CoursesModule {}
