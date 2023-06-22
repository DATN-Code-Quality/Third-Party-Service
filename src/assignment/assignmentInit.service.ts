import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { AssignmentDBService } from './assignmentDB.service';
import { AssignmentResDto } from './res/assignment-res.dto';

@Injectable()
export class AssignmentInitationService implements OnModuleInit {
  constructor(
    private readonly assignmentDBService: AssignmentDBService,
    private readonly schedulerService: SchedulerService,
  ) {}

  async onModuleInit() {
    const { data: assignments } = await this.assignmentDBService.findAll(
      AssignmentResDto,
    );

    if (assignments !== null && assignments.length > 0) {
      assignments.forEach((assignment) => {
        if (
          Number(assignment.assignmentMoodleId) > 0 ||
          new Date(assignment.dueDate).getTime() - Date.now() > 0
        ) {
          this.schedulerService.startJob(
            assignment.id,
            assignment.assignmentMoodleId,
            new Date(assignment.dueDate).getTime(),
          );
        }
      });
    }
  }
}
