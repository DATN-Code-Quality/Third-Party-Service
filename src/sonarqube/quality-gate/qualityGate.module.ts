import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { QualityGateController } from './qualityGate.controller';
import { QualityGateService } from './qualityGate.service';
import { SubmissionModule } from 'src/submission/submission.module';
import { ProjectModule } from 'src/project/project.module';
import { ResultModule } from '../result/result.module';

@Module({
  imports: [HttpModule, SubmissionModule, ProjectModule, ResultModule],
  controllers: [QualityGateController],
  providers: [QualityGateService],
})
export class QualityGatesModule {}
