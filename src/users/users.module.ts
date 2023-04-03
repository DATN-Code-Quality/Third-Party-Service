import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MoodleModule } from 'src/moodle/moodle.module';

@Module({
  imports: [MoodleModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
