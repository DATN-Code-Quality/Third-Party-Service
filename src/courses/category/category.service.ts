import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Category } from './interfaces/Category';
import { MoodleService } from 'src/moodle/moodle.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('MOODLE_MODULE') private readonly moodle: MoodleService,
    private readonly httpService: HttpService,
  ) {}

  async getAllCategory(): Promise<Category[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.moodle.host}/webservice/rest/server.php`, {
          params: {
            wstoken: this.moodle.token,
            wsfunction: 'core_course_get_categories',
            moodlewsrestformat: 'json',
            'criteria[0][key]': 'parent',
            'criteria[0][value]': '%',
          },
        })
        .pipe(),
    );

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.name,
        categoryMoodleId: item.id,
      }));
    }

    return [];
  }
}
