import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoodleModule } from './moodle/moodle.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/course.module';
import { CategoryModule } from './courses/category/category.module';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [
    MoodleModule,
    UsersModule,
    CoursesModule,
    CategoryModule,
    AssignmentModule,
    {
      ...HttpModule.register({
        baseURL: process.env.MOODLE_BASE_URL,
      }),
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MoodleModule],
})
export class AppModule {}
