import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';
import { Components } from './interfaces/Component';

@Injectable()
export class ComponentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getComponentsBySubmissionId(
    submissionId: string,
    page: number,
    pageSize: number,
  ): Promise<Components> {
    const project = await this.projectService.findProjectBySubmissionId(
      submissionId,
    );
    if (project == null) {
      return null;
    }

    let url = null;
    let auth = null;

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
        .get(`${url}/components/tree`, {
          auth: auth,
          params: {
            component: project.key,
            qualifiers: 'FIL',
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
        components: data.components,
      };
    }

    return null;
  }
}
