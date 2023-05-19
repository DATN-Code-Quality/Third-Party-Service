import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { moodleArrayInput } from 'src/utils';
import { Issue, IssueSonarqubeDTO } from '../issue/interfaces/Issue';
import { ProjectService } from 'src/project/project.service';
import {
  CONDITION,
  Condition,
  converConditionFromArrayToJson,
} from './interfaces/qualityGate';
import axios from 'axios';
import { SubmissionDBService } from 'src/submission/submissionDB.service';
import { SubmissionService } from 'src/submission/submission.service';

@Injectable()
export class QualityGateService {
  constructor(
    // @Inject('MOODLE_MODULE') private readonly token: string,
    private readonly httpService: HttpService,
    private readonly submissionDBService: SubmissionDBService,
    private readonly submissionService: SubmissionService,
  ) {}

  async createQualityGate(
    assignmentId: string,
    conditions: Condition[],
  ): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.SONARQUBE_BASE_URL}/qualitygates/create`, null, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: { name: assignmentId },
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });

    if (data['id']) {
      const conditionJson = converConditionFromArrayToJson(conditions);
      for (let i = 0; i < CONDITION.length; i++) {
        if (
          conditionJson[`${CONDITION[i].key}`] ||
          conditionJson[`${CONDITION[i].key}`] === 0
        ) {
          firstValueFrom(
            this.httpService
              .post(
                `${process.env.SONARQUBE_BASE_URL}/qualitygates/create_condition`,
                null,
                {
                  auth: {
                    username: process.env.SONARQUBE_USERNAME,
                    password: process.env.SONARQUBE_PASSWORD,
                  },
                  params: {
                    error: conditionJson[`${CONDITION[i].key}`],
                    gateName: assignmentId,
                    metric: CONDITION[i].key,
                    op: CONDITION[i].op,
                  },
                },
              )
              .pipe(),
          ).catch((e) => {
            throw e;
          });
        }
      }
      return data['id'];
    }
    return '';
  }

  async updateConditions(
    assignmentId: string,
    conditions: Condition[],
  ): Promise<string> {
    // assignmentId = '042c3744-78e8-4fad-a96d-86bd7e168ce1';
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.SONARQUBE_BASE_URL}/qualitygates/show`, {
          auth: {
            username: process.env.SONARQUBE_USERNAME,
            password: process.env.SONARQUBE_PASSWORD,
          },
          params: {
            name: assignmentId,
          },
          timeout: 60000,
        })
        .pipe(),
    ).catch((e) => {
      throw e;
    });

    const conditionJson = converConditionFromArrayToJson(conditions);
    const conditionIdJson = {};
    data.conditions.forEach((condition) => {
      conditionIdJson[`${condition.metric}`] = condition.id;
    });

    for (let i = 0; i < CONDITION.length; i++) {
      if (conditionJson[`${CONDITION[i].key}`] != null) {
        await firstValueFrom(
          this.httpService
            .post(
              `${process.env.SONARQUBE_BASE_URL}/qualitygates/update_condition`,
              null,
              {
                auth: {
                  username: process.env.SONARQUBE_USERNAME,
                  password: process.env.SONARQUBE_PASSWORD,
                },
                params: {
                  error: conditionJson[`${CONDITION[i].key}`],
                  id: conditionIdJson[`${CONDITION[i].key}`],
                  metric: CONDITION[i].key,
                  op: CONDITION[i].op,
                },
              },
            )
            .pipe(),
        ).catch((e) => {
          throw e;
        });
      }
    }

    // Call to scanner service to scan all submissions in this assignment
    const submisisons =
      await this.submissionDBService.findSubmissionsByAssigmentId(assignmentId);
    if (submisisons.isOk()) {
      for (let i = 0; i < submisisons.data.length; i++) {
        await this.submissionService.scanCodes(submisisons.data[i] as any);
      }
    }

    return 'Update condition successfully';
  }
}
