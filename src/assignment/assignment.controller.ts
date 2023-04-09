import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AssignmentService } from './assignment.service';
import {
  AssignmentsResponce,
  GetAssignmentsOfCourseRequest,
} from './interfaces/Assignment';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}
  @GrpcMethod('AssignmentService', 'GetAllAssignmentsByCourseId')
  async getAllAssignmentsByCourseId(
    data: GetAssignmentsOfCourseRequest,
    meta: Metadata,
  ): Promise<AssignmentsResponce> {
    const assignments = await this.service.getAllAssignmentsByCourseId(
      data.courseMoodleId,
    );
    return {
      assignments,
      error: 0,
    };
  }
}
