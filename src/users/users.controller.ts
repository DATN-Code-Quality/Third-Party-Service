import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { User, UserRequest } from './interfaces/User';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod('GUserService', 'GetUsersByEmails')
  async getUsersByEmails(
    data: UserRequest,
    _: Metadata,
  ): Promise<OperationResult<User[]>> {
    return this.userService.getUserByField('email', data.emails);
  }

  @GrpcMethod('GUserService', 'GetAllUsers')
  async getAllUsers(meta: Metadata): Promise<OperationResult<User[]>> {
    return this.userService.getAllUsers();
  }
}
