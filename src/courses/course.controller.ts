import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CoursesService } from './course.service';
import {
  CoursesResponce,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from './interfaces/Course';
import { ValidationPipe } from 'src/common/validation.pipe';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @GrpcMethod('GCourseService', 'GetAllCourses')
  async getAllCourses(meta: Metadata): Promise<CoursesResponce> {
    const courses = await this.service.getAllCourses();
    return {
      data: courses,
      error: 0,
    };
  }

  @GrpcMethod('GCourseService', 'GetUsersCourse')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getUsersCourse(
    data: GetCourseOfUserRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getUsersCourse(data.userMoodleId);

    return {
      data: courses,
      error: 0,
    };
  }

  @GrpcMethod('GCourseService', 'GetCoursesByCategory')
  async getCoursesByCategory(
    data: GetCourseOfCategoryRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getCoursesByCategory(
      data.categoryMoodleId,
    );

    return {
      data: courses,
      error: 0,
    };
  }
  @GrpcMethod('GCourseService', 'GetCoursesByMoodleId')
  async getCoursesByMoodleId(
    data: GetCourseOfMoodleIdRequest,
    meta: Metadata,
  ): Promise<CoursesResponce> {
    const courses = await this.service.getCoursesByMoodleId(
      data.courseMoodleId,
    );

    return {
      data: courses,
      error: 0,
    };
  }
}
