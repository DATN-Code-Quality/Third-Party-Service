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

    if (
      project.type === PROJECT_TYPE.C_CPP ||
      project.type === PROJECT_TYPE.C
    ) {
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

  async getAllIssuesBySubmissionId(
    submissionId: string,
    type: string,
    severity: string,
    rule: string,
    file: string,
    fileuuid: string,
    page: number,
    pageSize: number,
  ): Promise<Issue> {
    if (page < 1 || pageSize < 1) {
      const tempPageSize = 500;
      let data = await this.getIssuesBySubmissionId(
        submissionId,
        type,
        severity,
        rule,
        file,
        fileuuid,
        1,
        tempPageSize,
      );

      while (data.p * tempPageSize < data.total) {
        data.p = data.p + 1;
        const tempData = await this.getIssuesBySubmissionId(
          submissionId,
          type,
          severity,
          rule,
          file,
          fileuuid,
          data.p,
          tempPageSize,
        );
        data.issues = [...data.issues, ...tempData.issues];

        const newComponents = [];
        for (let tempComponent of tempData.components) {
          let isExist = false;
          for (let component of data.components) {
            if (component.key == tempComponent.key) {
              isExist = true;
              break;
            }
          }

          if (!isExist) {
            newComponents.push(tempComponent);
          }
        }
        data.components = [...data.components, ...newComponents];

        const newRules = [];
        for (let tempRule of tempData.rules) {
          let isExist = false;
          for (let rule of data.rules) {
            if (rule.key == tempRule.key) {
              isExist = true;
              break;
            }
          }

          if (!isExist) {
            newRules.push(tempRule);
          }
        }
        data.rules = [...data.rules, ...newRules];
      }

      data.p = 1;
      data.ps = data.total;

      return data;
    } else {
      return await this.getIssuesBySubmissionId(
        submissionId,
        type,
        severity,
        rule,
        file,
        fileuuid,
        page,
        pageSize,
      );
    }
  }
}
