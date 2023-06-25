import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { AssignmentDBService } from './assignmentDB.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';
import { AssignmentInitationService } from './assignmentInit.service';

@Module({
  imports: [
    SchedulerModule,
    TypeOrmModule.forFeature([AssignmentReqDto, AssignmentResDto]),
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService, AssignmentDBService, AssignmentInitationService],
  exports: [AssignmentService, AssignmentDBService],
})
export class AssignmentModule {}
