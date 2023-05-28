import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { Issue } from '../issue/interfaces/Issue';

@Injectable()
export class IssuesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getIssuesBySubmissionId(
    submissionId: string,
    type: string,
    severity: string,
    rule: string,
    file: string,
    page: number,
    pageSize: number,
  ): Promise<Issue> {
    const project = await this.projectService.findProjectBySubmissionId(
      submissionId,
    );
    if (project == null) {
      return null;
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.SONARQUBE_BASE_URL}/issues/search`, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: {
            componentKeys: project.key,
            additionalFields: 'rules',
            types: type,
            rules: rule,
            severities: severity,
            files: file,
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
        total: data.total,
        p: data.p,
        ps: data.ps,
        effortTotal: data.effortTotal,
        issues: data.issues,
        components: data.components,
        rules: data.rules,
      };
    }

    return null;
  }
}
