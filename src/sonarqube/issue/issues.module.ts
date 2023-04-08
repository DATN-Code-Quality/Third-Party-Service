import { HttpModule, HttpService } from '@nestjs/axios';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Module } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
