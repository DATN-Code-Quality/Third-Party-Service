import { HttpModule, HttpService } from '@nestjs/axios';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
