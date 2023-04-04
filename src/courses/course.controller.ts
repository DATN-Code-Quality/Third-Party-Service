import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CoursesService } from './course.service';
import { CoursesResponce, GetCourseOfUserRequest } from './interfaces/Course';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @GrpcMethod('CourseService', 'GetUsersCourse')
  async getUsersCourse(
    data: GetCourseOfUserRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getUsersCourse(data.userMoodleId);

    return {
      courses,
      error: 0,
    };
  }
}
