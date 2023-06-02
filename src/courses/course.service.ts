import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Course, CourseModelDTO as CourseMoodelDTO } from './interfaces/Course';
import { OperationResult } from 'src/common/operation-result';
import { MoodleService } from 'src/moodle/moodle.service';

@Injectable()
export class CoursesService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly moodle: MoodleService,
    private readonly httpService: HttpService,
  ) {}

  async getAllCourses(): Promise<OperationResult<Course[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_course_get_courses',
              moodlewsrestformat: 'json',
            },
          })
          .pipe(),
      );
      if (data && data.length > 0) {
        const ret = data.map(this.buildCourse);
        return OperationResult.ok(ret);
      }
    } catch (error) {
      Logger.error(error, 'CoursesService.getAllCourses');
      return OperationResult.error(error, []);
    }
  }

  async getUsersCourse(
    userMoodleId: number,
  ): Promise<OperationResult<Course[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_enrol_get_users_courses',
              moodlewsrestformat: 'json',
              userid: userMoodleId,
            },
          })
          .pipe(),
      );

      if (data && data.length > 0) {
        const ret = data.map(this.buildCourse);
        return OperationResult.ok(ret);
      }
    } catch (error) {
      Logger.error(error, 'CoursesService.getUsersCourse');
      return OperationResult.error(error, []);
    }
  }

  async getCoursesByCategory(
    categoryMoodleId: number,
  ): Promise<OperationResult<Course[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_course_get_courses_by_field',
              moodlewsrestformat: 'json',
              field: 'category',
              value: categoryMoodleId,
            },
          })
          .pipe(),
      );

      if (data && data.courses.length > 0) {
        const ret = data.courses.map(this.buildCourse);
        return OperationResult.ok(ret);
      }
    } catch (error) {
      Logger.error(error, 'CoursesService.getCoursesByCategory');
      return OperationResult.error(error, []);
    }
  }

  async getCoursesByMoodleId(
    courseMoodleId: number,
  ): Promise<OperationResult<Course[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_course_get_courses_by_field',
              moodlewsrestformat: 'json',
              field: 'id',
              value: courseMoodleId,
            },
          })
          .pipe(),
      );

      if (data && data.courses.length > 0) {
        const ret = data.courses.map(this.buildCourse);
        return OperationResult.ok(ret);
      }
    } catch (error) {
      Logger.error(error, 'CoursesService.getCoursesByMoodleId');
      return OperationResult.error(error, []);
    }
  }

  private buildCourse(data: CourseMoodelDTO): Course {
    return {
      name: data.fullname,
      moodleId: '',
      courseMoodleId: data.id,
      startAt: data.startdate + '',
      endAt: data.enddate + '',
      detail: '',
      summary: data.summary,
      categoryId: data.categoryid + '',
    };
  }
}
