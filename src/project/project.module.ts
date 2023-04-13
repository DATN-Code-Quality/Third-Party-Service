import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectDto } from './req/project.dto';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectDto])],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
