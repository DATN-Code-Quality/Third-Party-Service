import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Submission } from './interfaces/Submission';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getSubmissionsByAssignmentId(
    assignmentMoodleId: string,
  ): Promise<Submission[]> {
    console.log(assignmentMoodleId);
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
        userId: item.userid,
        origin: '',
        status: item.status,
        grade: null,
        submissionMoodleId: item.id,
      }));
    }

    return [];
  }
}
