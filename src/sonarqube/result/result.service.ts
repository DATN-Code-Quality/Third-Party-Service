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
      const resultPageIndex = data.paging.pageIndex;
      const resultPageSize = data.paging.pageSize;
      const resultTotal = data.paging.total;

      if (resultPageIndex * resultPageSize < resultTotal) {
        const result = await firstValueFrom(
          this.httpService
            .get(`${url}/measures/search_history`, {
              auth: auth,
              params: {
                component: project.key,
                metrics:
                  'bugs,vulnerabilities,code_smells,sqale_index,duplicated_lines_density,ncloc,coverage,reliability_rating,security_rating,sqale_rating,violations,blocker_violations,critical_violations,major_violations,minor_violations,info_violations',
                // from: ,
                // to: ,
                p:
                  Math.floor(resultTotal / resultPageSize) +
                  (resultTotal % resultPageSize == 0 ? 0 : 1),
                ps: resultPageSize,
              },
              timeout: 60000,
            })
            .pipe(),
        ).catch((e) => {
          throw e;
        });

        if (result.data !== null) {
          return {
            paging: result.data.paging,
            measures: result.data.measures,
          };
        }
      } else {
        return {
          paging: data.paging,
          measures: data.measures,
        };
      }
    }

    return null;
  }

  async getOverviewResultsBySubmissionId(submissionId: string): Promise<any> {
    return await this.getResultsBySubmissionId(submissionId, 1, 100)
      .then((result) => {
        const overview = {};
        result.measures.forEach((metric) => {
          overview[`${metric.metric}`] =
            metric.history[metric.history.length - 1].value;
        });
        return overview;
      })
      .catch((e) => {
        return null;
      });
  }
}
