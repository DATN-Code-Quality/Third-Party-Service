import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReqDto } from './req/user-req.dto';
import { UserResDto } from './res/user-res.dto';
import { UsersDBService } from './usersDB.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserReqDto, UserResDto])],
  controllers: [UsersController],
  providers: [UsersService, UsersDBService],
  exports: [UsersDBService],
})
export class UsersModule {}
