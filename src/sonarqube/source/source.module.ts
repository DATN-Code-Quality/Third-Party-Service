import { HttpModule } from '@nestjs/axios';

import { Module } from '@nestjs/common';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
  imports: [HttpModule],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
