import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CoursesService } from './course.service';
import {
  Course,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from './interfaces/Course';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @GrpcMethod('GCourseService', 'GetAllCourses')
  async getAllCourses(meta: Metadata): Promise<OperationResult<Course[]>> {
    console.log(await this.service.getAllCourses());
    return null;
    // return this.service.getAllCourses();
  }

  @GrpcMethod('GCourseService', 'GetUsersCourse')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getUsersCourse(
    data: GetCourseOfUserRequest,
    meta: Metadata,
  ): Promise<OperationResult<Course[]>> {
    return this.service.getUsersCourse(data.userMoodleId);
  }

  @GrpcMethod('GCourseService', 'GetCoursesByCategory')
  async getCoursesByCategory(
    data: GetCourseOfCategoryRequest,
    meta: Metadata,
  ): Promise<OperationResult<Course[]>> {
    return this.service.getCoursesByCategory(data.categoryMoodleId);
  }

  @GrpcMethod('GCourseService', 'GetCoursesByMoodleId')
  async getCoursesByMoodleId(
    data: GetCourseOfMoodleIdRequest,
    meta: Metadata,
  ): Promise<OperationResult<Course[]>> {
    return this.service.getCoursesByMoodleId(data.courseMoodleId);
  }
}
