import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
