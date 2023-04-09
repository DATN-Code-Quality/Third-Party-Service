import { Module } from '@nestjs/common';
import { SubmissionsController } from './submission.controller';
import { SubmissionsService } from './submission.service';

@Module({
  imports: [],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
