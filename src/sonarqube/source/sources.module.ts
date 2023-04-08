import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
