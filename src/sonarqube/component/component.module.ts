import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';

@Module({
  imports: [HttpModule, ProjectModule],
  controllers: [ComponentController],
  providers: [ComponentService],
})
export class ComponentModule {}
