import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { ProjectService } from 'src/project/project.service';
import { Source } from './interfaces/Source';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';

@Injectable()
export class SourcesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getSourcesByKey(key: string): Promise<Source[]> {
    let url = null;
    let params = null;
    let auth = null;

    const projectKey = key.split(':')[0];
    const project = await this.projectService.findProjectByKey(projectKey);

    if (project == null) {
      return null;
    }

    if (project.type === PROJECT_TYPE.C_CPP) {
      url = process.env.SONARCLOUD_URL;
    } else {
      url = process.env.SONARQUBE_BASE_URL;
      auth = {
        username: process.env.SONARQUBE_USERNAME,
        password: process.env.SONARQUBE_PASSWORD,
      };
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${url}/sources/lines`, {
          auth: auth,
          params: { key: key },
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });

    if (data) {
      return data.sources.map((item: Source) => ({
        line: item.line,
        code: item.code,
      }));
    }

    return null;
  }
}
