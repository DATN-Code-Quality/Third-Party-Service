import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { ProjectService } from 'src/project/project.service';
import { Source } from './interfaces/Source';

@Injectable()
export class SourcesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getSourcesByKey(key: string): Promise<Source[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.SONARQUBE_BASE_URL}/sources/lines`, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: { key: key },
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });
    // if (data) {
    //   const sources = [
    //     ...data.sources.map((source: Source) => ({})),
    //   ] as Source[];
    //   return {
    //     sources: sources,
    //   };
    // }

    if (data) {
      return data.sources.map((item: Source) => ({
        line: item.line,
        code: item.code,
      }));
    }

    return null;
  }
}
