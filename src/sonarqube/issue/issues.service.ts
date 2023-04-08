import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { Issue, IssueSonarqubeDTO } from '../issue/interfaces/Issue';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class IssuesService {
  constructor(
    // @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getIssuesBySubmissionId(
    submissionId: string,
    type: string,
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
            types: type,
            p: page,
            ps: pageSize,
          },
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
