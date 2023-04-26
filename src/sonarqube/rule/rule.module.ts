import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { RulesController } from './rule.controller';
import { RulesService } from './rule.service';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RuleModule {}
