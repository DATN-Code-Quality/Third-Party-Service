import { Controller, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UserRequest } from './interfaces/User';
import { Metadata } from '@grpc/grpc-js';
import { User, UserResponse } from './interfaces/User';
import { HttpService } from '@nestjs/axios';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod('UserService', 'GetUsersByEmails')
  async getUsersByEmails(
    data: UserRequest,
    meta: Metadata,
  ): Promise<UserResponse> {
    return {
      users: await this.userService.getUserByField('email', data.emails),
      error: 0,
    };
  }
  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers(meta: Metadata): Promise<UserResponse> {
    return {
      users: await this.userService.getAllUsers(),
      error: 0,
    };
  }
}
