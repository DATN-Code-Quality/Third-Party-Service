import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { firstValueFrom } from 'rxjs';
import { TaskQueue, Workflows } from 'src/temporal/workflows';
import { Submission } from './interfaces/Submission';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    @InjectTemporalClient() private readonly client: WorkflowClient,
    private readonly httpService: HttpService,
  ) {}

  async getSubmissionsByAssignmentId(
    assignmentMoodleId: string,
  ): Promise<Submission[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'mod_assign_get_submissions',
            moodlewsrestformat: 'json',
            'assignmentids[0]': assignmentMoodleId,
          },
        })
        .pipe(),
    );
    const dataSubmission = data?.assignments[0].submissions;

    if (dataSubmission && dataSubmission.length > 0) {
      return dataSubmission.map((item: any) => ({
        assignmentId: '',
        //Hiện tại là lấy submission mới nhất
        link:
          item.plugins[0].fileareas[0].files[
            item.plugins[0].fileareas[0].files.length - 1
          ]?.fileurl || '',
        note: item.status,
        submitType: item.plugins[0].type,
        timemodified: new Date(item.timemodified),
        userId: item.userid,
        origin: '',
        status: item.status,
        grade: null,
        submissionMoodleId: item.id,
      }));
    }

    return [];
  }

  async scanCodes(submission: Submission): Promise<any> {
    const handle = await this.client.start(Workflows.ScannerWorkflow, {
      args: [submission],
      workflowId: `workflow_${submission.id}_${new Date().getTime()}`,
      taskQueue: TaskQueue.ScannerService,
    });
    const result = await handle.result();

    return result;
  }
}
