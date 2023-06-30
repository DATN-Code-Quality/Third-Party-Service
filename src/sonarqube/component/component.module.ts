import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { IssuesModule } from '../issue/issues.module';

@Module({
  imports: [HttpModule, ProjectModule, IssuesModule],
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}
