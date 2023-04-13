import { Injectable } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { Submission } from 'src/temporal/interfaces';
import { TaskQueue, Workflows } from '../temporal/workflows';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectTemporalClient() private readonly client: WorkflowClient,
  ) {}

  async scanCodes(): Promise<any> {
    const submission: Submission = {
      assignmentId: '1',
      grade: 0,
      id: '1',
      link: '',
      note: '',
      origin: '',
      status: false,
      submitType: '1',
      userId: '1',
    };

    const handle = await this.client.start(Workflows.ScannerWorkflow, {
      args: [submission],
      workflowId: `workflow-${new Date().getTime()}`,
      taskQueue: TaskQueue.ScannerService,
    });
    const result = await handle.result();

    return result;
  }
}
