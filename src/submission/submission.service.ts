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
    console.log(data?.assignments[0].submissions);
    // const dataSubmission = data?.assignments[0].submissions;

    // if (dataSubmission && dataSubmission.length > 0) {
    //   return dataSubmission.map((item: any) => ({
    //     assignmentId: data.assignments[0].assignmentid,
    //     link: '',
    //     note: string | null,
    //     submitType: string,
    //     userId: item.userid,
    //     origin: string,
    //     status: item.status,
    //     grade: number | null,
    //     submissionMoodleId: item.id,
    //   }));
    // }

    return [];
  }
}
