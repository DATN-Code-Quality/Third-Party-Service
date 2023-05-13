import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { QualityGateController } from './qualityGate.controller';
import { QualityGateService } from './qualityGate.service';

@Module({
  imports: [HttpModule],
  controllers: [QualityGateController],
  providers: [QualityGateService],
})
export class QualityGatesModule {}
