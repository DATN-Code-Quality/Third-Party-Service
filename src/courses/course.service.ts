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

  async getAllCourses(): Promise<Course[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'core_course_get_courses',
            moodlewsrestformat: 'json',
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

  async getCoursesByCategory(categoryMoodleId: string): Promise<Course[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'core_course_get_courses_by_field',
            moodlewsrestformat: 'json',
            field: 'category',
            value: categoryMoodleId,
          },
        })
        .pipe(),
    );

    if (data && data.courses.length > 0) {
      return data.courses.map((item: CourseMoodelDTO) => ({
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
  async getCoursesByMoodleId(courseMoodleId: string): Promise<Course[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: this.token,
            wsfunction: 'core_course_get_courses_by_field',
            moodlewsrestformat: 'json',
            field: 'id',
            value: courseMoodleId,
          },
        })
        .pipe(),
    );
    console.log(data);

    if (data && data.courses.length > 0) {
      return data.courses.map((item: CourseMoodelDTO) => ({
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
