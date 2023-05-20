import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { ValidationPipe } from 'src/common/validation.pipe';
import { CoursesService } from './course.service';
import {
  Course,
  CourseCronjobRequest,
  GetCourseOfCategoryRequest,
  GetCourseOfMoodleIdRequest,
  GetCourseOfUserRequest,
} from './interfaces/Course';
import { CourseInfoSchedulerService } from 'src/scheduler/courseInfoScheduler.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly service: CoursesService,
    private readonly schedulerService: CourseInfoSchedulerService,
  ) {}

  @GrpcMethod('GCourseService', 'GetAllCourses')
  async getAllCourses(meta: Metadata): Promise<OperationResult<Course[]>> {
    return this.service.getAllCourses();
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

  @GrpcMethod('GCourseService', 'AddCourseCronjob')
  async addCourseCronjob(data: CourseCronjobRequest, meta: Metadata) {
    this.schedulerService.startJob(data.id, data.courseMoodleId, data.endAt);
  }
}
