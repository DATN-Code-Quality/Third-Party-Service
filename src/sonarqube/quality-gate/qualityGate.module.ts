import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { QualityGateController } from './qualityGate.controller';
import { QualityGateService } from './qualityGate.service';
import { SubmissionModule } from 'src/submission/submission.module';

@Module({
  imports: [HttpModule, SubmissionModule],
  controllers: [QualityGateController],
  providers: [QualityGateService],
})
export class QualityGatesModule {}
