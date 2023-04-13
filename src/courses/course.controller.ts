import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CoursesService } from './course.service';
import {
  CoursesResponce,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from './interfaces/Course';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @GrpcMethod('CourseService', 'GetAllCourses')
  async getAllCourses(meta: Metadata): Promise<CoursesResponce> {
    const courses = await this.service.getAllCourses();
    return {
      courses,
      error: 0,
    };
  }

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

  @GrpcMethod('CourseService', 'GetCoursesByCategory')
  async getCoursesByCategory(
    data: GetCourseOfCategoryRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getCoursesByCategory(
      data.categoryMoodleId,
    );

    return {
      courses,
      error: 0,
    };
  }
  @GrpcMethod('CourseService', 'GetCoursesByMoodleId')
  async getCoursesByMoodleId(
    data: GetCourseOfMoodleIdRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getCoursesByMoodleId(
      data.courseMoodleId,
    );

    return {
      courses,
      error: 0,
    };
  }
}
