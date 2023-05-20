import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SubmissionDBService } from './submissionDB.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionReqDto, SubmissionResDto])],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionDBService],
  exports: [SubmissionService, SubmissionDBService],
})
export class SubmissionModule {}
