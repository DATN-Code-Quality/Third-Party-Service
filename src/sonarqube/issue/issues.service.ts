import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { Issue, IssueSonarqubeDTO } from '../issue/interfaces/Issue';

@Injectable()
export class IssuesService {
  constructor(
    // @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
  ) {}

  async getIssuesByKey(key: string): Promise<Issue> {
    // console.log('service: ' + key);
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.SONARQUBE_BASE_URL}/issues/search`, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: { componentKeys: key },
        })
        .pipe(),
    );

    if (data) {
      return {
        total: data.total,
        p: data.p,
        ps: data.ps,
        effortTotal: data.effortTotal,
        issues: data.issues,
        components: data.components,
      };
    }

    return null;
  }
}
