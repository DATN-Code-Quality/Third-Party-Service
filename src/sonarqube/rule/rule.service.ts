import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { ProjectService } from 'src/project/project.service';
import { RuleDetail } from './interfaces/Rule';

@Injectable()
export class RulesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
  ) {}

  async getRuleDetailByKey(key: string): Promise<RuleDetail> {
    const { data } = await firstValueFrom(
      // this.httpService
      //   .get(`${process.env.SONARQUBE_BASE_URL}/rules/show`, {
      //     auth: {
      //       username: process.env.SONARQUBE_USERNAME,
      //       password: process.env.SONARQUBE_PASSWORD,
      //     },
      //     params: { key: key },
      //   })
      this.httpService
        .get(`${process.env.SONARCLOUD_URL}/rules/show`, {
          params: {
            key: key,
            organization: process.env.SONARCLOUD_ORGANIZATION,
          },
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });

    if (data) {
      return {
        key: data.rule.key,
        repo: data.rule.repo,
        lang: data.rule.lang,
        langName: data.rule.langName,
        name: data.rule.name,
        type: data.rule.type,
        severity: data.rule.severity,
        debtRemFnOffset: data.rule.debtRemFnOffset,

        htmlDesc: data.rule.htmlDesc,
        mdDesc: data.rule.mdDesc,

        status: data.rule.status,
        scope: data.rule.scope,
        createdAt: data.rule.createdAt,
      };
    }

    return null;
  }
}
