import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Assignment } from './interfaces/Assignment';

@Injectable()
export class AssignmentService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getAllAssignmentsByCourseId(courseId: string): Promise<Assignment[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'mod_assign_get_assignments',
            moodlewsrestformat: 'json',
            'courseids[0]': courseId,
            includenotenrolledcourses: 1,
          },
        })
        .pipe(),
    );
    const dataAssignments = data?.courses[0].assignments;
    if (data && dataAssignments.length > 0) {
      return dataAssignments.map((item: any) => ({
        name: item.name,
        dueDate: item.duedate,
        status: true,
        courseId: item.course,
        description: '',
        attachmentFileLink: '',
        config: '',
        assignmentMoodleId: courseId,
      }));
    }

    return [];
  }
}
