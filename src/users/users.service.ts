import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { User, UserMoodelDTO } from './interfaces/User';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getUserByField(field: string, values: string[]): Promise<User[]> {
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
      return data.map((item: UserMoodelDTO) => ({
        name: item.fullname,
        role: '',
        email: item.email,
        userId: '',
        moodleId: item.id,
        password: '',
        status: false,
      }));
    }

    return [];
  }
}
