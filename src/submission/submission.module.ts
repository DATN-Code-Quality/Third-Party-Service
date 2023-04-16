import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { SubmissionDBService } from './submissionDB.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionReqDto } from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionReqDto, SubmissionResDto])],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionDBService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
