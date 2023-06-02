import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { Issue } from '../issue/interfaces/Issue';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';

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
    fileuuid: string,
    page: number,
    pageSize: number,
  ): Promise<Issue> {
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
      params = {
        componentKeys: project.key,
        additionalFields: 'rules',
        types: type,
        rules: rule,
        severities: severity,
        p: page,
        ps: pageSize,
        fileUuids: fileuuid,
        resolved: false,
      };
    } else {
      url = process.env.SONARQUBE_BASE_URL;
      params = {
        componentKeys: project.key,
        additionalFields: 'rules',
        types: type,
        rules: rule,
        severities: severity,
        files: file,
        p: page,
        ps: pageSize,
        resolved: false,
      };
      auth = {
        username: process.env.SONARQUBE_USERNAME,
        password: process.env.SONARQUBE_PASSWORD,
      };
    }

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${url}/issues/search`, {
          auth: auth,
          params: params,
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
