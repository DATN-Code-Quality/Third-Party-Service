import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OperationResult, ResultStatus } from 'src/common/operation-result';
import { moodleArrayInput } from 'src/utils';
import { USER_STATUS, User } from './interfaces/User';
import { MoodleService } from 'src/moodle/moodle.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly moodle: MoodleService,
    private readonly httpService: HttpService,
  ) {}

  async getUserByField(
    field: string,
    values: string[],
  ): Promise<OperationResult<User[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_user_get_users_by_field',
              moodlewsrestformat: 'json',
              field: field,
              ...moodleArrayInput('values', values),
            },
          })
          .pipe(),
      );

      if (data && data.length > 0) {
        return data.map(this.buildUser);
      }
    } catch (error) {
      Logger.error(error, 'UsersService.getUserByField');
      return OperationResult.error(error, []);
    }
  }

  async getAllUsers(): Promise<OperationResult<User[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_user_get_users',
              moodlewsrestformat: 'json',
              'criteria[0][key]': 'lastname',
              'criteria[0][value]': '%',
            },
          })
          .pipe(),
      );
      if (data && data.users.length > 0) {
        const ret = data.users.map(this.buildUser);
        return OperationResult.ok(ret);
      }
    } catch (error) {
      Logger.error(error, 'UsersService.getAllUsers');
      return OperationResult.error(error, []);
    }
  }

  async getUsersByCourseMoodleId(
    courseid: number,
  ): Promise<OperationResult<User[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.moodle.host}/webservice/rest/server.php`, {
            params: {
              wstoken: this.moodle.token,
              wsfunction: 'core_enrol_get_enrolled_users',
              moodlewsrestformat: 'json',
              courseid: courseid,
            },
          })
          .pipe(),
      );
      const check = data.some((user) => user.roles.length !== 0);
      if (data && data.length > 0 && check) {
        const ret = data.map((user) => {
          const role = user.roles.some(
            (r) => r.shortname == 'editingteacher' || r.shortname == 'teacher',
          );
          return {
            name: user.fullname,
            role: role ? 'teacher' : 'student',
            email: user.email,
            userId: user.username,
            moodleId: user.id,
            password: '',
            // status: USER_STATUS.ACTIVE,
          };
        });
        return OperationResult.ok(ret);
      } else {
        return new OperationResult(
          ResultStatus.EMPTY_ARRAY,
          [],
          'No participants in this course',
        );
      }
    } catch (error) {
      Logger.error(error, 'UsersService.getUsersByCourseMoodleId');
      return OperationResult.error(error, []);
    }
  }

  private buildUser(moodleUser: any): User {
    return {
      name: moodleUser.fullname,
      role: '',
      email: moodleUser.email,
      userId: moodleUser.username,
      moodleId: moodleUser.id,
      password: '',
      status: USER_STATUS.INACTIVE,
    };
  }
}
