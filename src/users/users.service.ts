import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OperationResult } from 'src/common/operation-result';
import { moodleArrayInput } from 'src/utils';
import { USER_STATUS, User } from './interfaces/User';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getUserByField(
    field: string,
    values: string[],
  ): Promise<OperationResult<User[]>> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
            params: {
              wstoken: this.token,
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
          .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
            params: {
              wstoken: this.token,
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
          .get(`${process.env.MOODLE_BASE_URL}/webservice/rest/server.php`, {
            params: {
              wstoken: this.token,
              wsfunction: 'core_enrol_get_enrolled_users',
              moodlewsrestformat: 'json',
              courseid: courseid,
            },
          })
          .pipe(),
      );
      if (data && data.users.length > 0) {
        const ret = data.users.map((user) => {
          return {
            name: user.fullname,
            role:
              user.roles[0].shortname == 'editingteacher' ||
              user.roles[0].shortname == 'teacher'
                ? 'teacher'
                : 'student',
            email: user.email,
            userId: user.username,
            moodleId: user.id,
            password: '',
            status: USER_STATUS.ACTIVE,
          };
        });
        return OperationResult.ok(ret);
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
