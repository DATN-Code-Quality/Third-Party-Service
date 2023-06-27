import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';
import { Components } from './interfaces/Component';
import { IssuesService } from '../issue/issues.service';

@Injectable()
export class ComponentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
    private readonly issueService: IssuesService,
  ) {}

  async getComponentsBySubmissionId(submissionId: string): Promise<Components> {
    // const project = await this.projectService.findProjectBySubmissionId(
    //   submissionId,
    // );
    // if (project == null) {
    //   return null;
    // }

    // let url = null;
    // let auth = null;

    // if (project.type === PROJECT_TYPE.C_CPP) {
    //   url = process.env.SONARCLOUD_URL;
    // } else {
    //   url = process.env.SONARQUBE_BASE_URL;
    //   auth = {
    //     username: process.env.SONARQUBE_USERNAME,
    //     password: process.env.SONARQUBE_PASSWORD,
    //   };
    // }

    // const { data } = await firstValueFrom(
    //   this.httpService
    //     .get(`${url}/components/tree`, {
    //       auth: auth,
    //       params: {
    //         component: project.key,
    //         qualifiers: 'FIL',
    //         p: page,
    //         ps: pageSize,
    //       },
    //       timeout: 60000,
    //     })
    //     .pipe(),
    // ).catch((e) => {
    //   throw e;
    // });

    // if (data !== null) {
    //   return {
    //     paging: data.paging,
    //     components: data.components,
    //   };
    // }

    const issues = await this.issueService.getAllIssuesBySubmissionId(
      submissionId,
      null,
      null,
      null,
      null,
      null,
      0,
      0,
    );

    const components = issues.components.filter((component) => {
      return component.qualifier === 'FIL';
    });

    return {
      paging: {
        pageIndex: 1,
        pageSize: components.length,
        total: components.length,
      },
      components: components,
    };
  }
}
