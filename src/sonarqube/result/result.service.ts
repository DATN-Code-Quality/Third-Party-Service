import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { Result } from './interfaces/Result';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';

@Injectable()
export class ResultService {
  constructor(
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
    if (project == null) {
      return null;
    }
    let url = null;
    let params = null;
    let auth = null;

    if (project.type === PROJECT_TYPE.C_CPP) {
      url = process.env.SONARCLOUD_URL;
      // params = {
      //   componentKeys: project.key,
      //   p: page,
      //   ps: pageSize,
      // };
    } else {
      url = process.env.SONARQUBE_BASE_URL;
      // params = {
      //   componentKeys: project.key,
      //   p: page,
      //   ps: pageSize,
      // };
      auth = {
        username: process.env.SONARQUBE_USERNAME,
        password: process.env.SONARQUBE_PASSWORD,
      };
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${url}/measures/search_history`, {
          auth: auth,
          params: {
            component: project.key,
            metrics:
              'bugs,vulnerabilities,code_smells,sqale_index,duplicated_lines_density,ncloc,coverage,reliability_rating,security_rating,sqale_rating,violations,blocker_violations,critical_violations,major_violations,minor_violations,info_violations',
            // from: ,
            // to: ,
            // p: page,
            // ps: pageSize,
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
