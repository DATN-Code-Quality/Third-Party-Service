import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
// import { CoursesController } from './course.controller';
// import { CoursesService } from './course.service';

@Module({
  imports: [],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
