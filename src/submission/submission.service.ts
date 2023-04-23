import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { firstValueFrom } from 'rxjs';
import { TaskQueue, Workflows } from 'src/temporal/workflows';
import { Submission } from './interfaces/Submission';
import { OperationResult } from 'src/common/operation-result';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    @InjectTemporalClient() private readonly client: WorkflowClient,
    private readonly httpService: HttpService,
  ) {}

  async getSubmissionsByAssignmentId(
    assignmentMoodleId: number,
  ): Promise<OperationResult<Submission[]>> {
    let ret: Submission[] = [];

    try {
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
        ret = dataSubmission.map(this.buildSubmission);
      }
    } catch (error) {
      Logger.error(error, 'SubmissionService.getSubmissionsByAssignmentId');
      return OperationResult.error(error, []);
    }

    return OperationResult.ok(ret);
  }

  private buildSubmission(moodleSubmission: any): Submission {
    return {
      assignmentId: '',
      id: '',
      //Hiện tại là lấy submission mới nhất
      link:
        moodleSubmission.plugins[0].fileareas[0].files[
          moodleSubmission.plugins[0].fileareas[0].files.length - 1
        ]?.fileurl || '',
      note: moodleSubmission.status,
      submitType: moodleSubmission.plugins[0].type,
      timemodified: new Date(moodleSubmission.timemodified).toString(),
      userId: moodleSubmission.userid,
      origin: '',
      status: moodleSubmission.status,
      grade: null,
      submissionMoodleId: moodleSubmission.id,
    };
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
