import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Assignment } from './interfaces/Assignment';
import { OperationResult } from 'src/common/operation-result';
import { MoodleService } from 'src/moodle/moodle.service';

@Injectable()
export class AssignmentService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly moodle: MoodleService,
    private readonly httpService: HttpService,
  ) {}

  async getAllAssignmentsByCourseId(
    courseId: number,
  ): Promise<OperationResult<Assignment[]>> {
    let ret: Assignment[] = null;

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
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
        ret = dataAssignments.map(this.buildAssignment);
      }
    } catch (error) {
      Logger.error(error, 'AssignmentService.getAllAssignmentsByCourseId');
      return OperationResult.error(error, []);
    }

    return OperationResult.ok(ret);
  }

  private buildAssignment(moodleAssignment: any): Assignment {
    return {
      name: moodleAssignment.name,
      dueDate: moodleAssignment.duedate,
      status: true,
      courseId: moodleAssignment.course,
      description: '',
      attachmentFileLink: '',
      config: '',
      assignmentMoodleId: moodleAssignment.id,
    };
  }
}
