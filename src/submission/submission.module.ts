import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

@Module({
  imports: [],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionsModule {}
