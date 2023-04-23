import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserRequest, UserResponse } from './interfaces/User';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod('GUserService', 'GetUsersByEmails')
  async getUsersByEmails(
    data: UserRequest,
    meta: Metadata,
  ): Promise<UserResponse> {
    return {
      data: await this.userService.getUserByField('email', data.emails),
      error: 0,
    };
  }

  @GrpcMethod('GUserService', 'GetAllUsers')
  async getAllUsers(meta: Metadata): Promise<UserResponse> {
    return {
      data: await this.userService.getAllUsers(),
      error: 0,
    };
  }
}
