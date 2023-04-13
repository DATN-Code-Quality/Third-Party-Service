import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}
  // @GrpcMethod('CourseService', 'GetAllCourses')
  // async getAllCourses(meta: Metadata): Promise<CoursesResponce> {
  //   const courses = await this.service.getAllCourses();
  //   return {
  //     courses,
  //     error: 0,
  //   };
  // }
}
