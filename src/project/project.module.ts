import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectReqDto } from './req/project-req.dto';
import { ProjectResDto } from './res/project-res.dto';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectReqDto, ProjectResDto])],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
