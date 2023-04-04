import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Course, CourseModelDTO as CourseMoodelDTO } from './interfaces/Course';

@Injectable()
export class CoursesService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getUsersCourse(userMoodleId: string): Promise<Course[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'core_enrol_get_users_courses',
            moodlewsrestformat: 'json',
            userid: userMoodleId,
          },
        })
        .pipe(),
    );

    if (data && data.length > 0) {
      return data.map((item: CourseMoodelDTO) => ({
        name: item.fullname,
        moodleId: '',
        courseMoodleId: item.id,
        startAt: item.startdate,
        endAt: item.enddate,
        detail: '',
        summary: item.summary,
        categoryId: item.category,
      }));
    }

    return [];
  }
}
