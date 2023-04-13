import { HttpModule } from '@nestjs/axios';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
