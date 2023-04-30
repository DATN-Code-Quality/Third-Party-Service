import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { Result } from './interfaces/Result';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class ResultService {
  constructor(
    // @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getResultsBySubmissionId(
    submissionId: string,
    page: number,
    pageSize: number,
  ): Promise<Result> {
    const project = await this.projectService.findProjectBySubmissionId(
      submissionId,
    );
    console.log(project);
    if (project == null) {
      return null;
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.SONARQUBE_BASE_URL}/measures/search_history`, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: {
            component: project.key,
            metrics:
              'bugs,vulnerabilities,sqale_index,duplicated_lines_density,ncloc,coverage,code_smells,reliability_rating,security_rating,sqale_rating',
            // from: ,
            // to: ,
            p: page,
            ps: pageSize,
          },
          timeout: 60000,
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });

    if (data !== null) {
      return {
        paging: data.paging,
        measures: data.measures,
      };
    }

    return null;
  }
}
