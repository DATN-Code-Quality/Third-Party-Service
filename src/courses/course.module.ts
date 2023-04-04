import { Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
