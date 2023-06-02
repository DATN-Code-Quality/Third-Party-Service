import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SubmissionService } from 'src/submission/submission.service';
import { SubmissionDBService } from 'src/submission/submissionDB.service';
import {
  CONDITION,
  Condition,
  converConditionFromArrayToJson,
} from './interfaces/qualityGate';

@Injectable()
export class QualityGateService {
  constructor(
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
      await this.createConditions(assignmentId, conditions).catch((e) => {
        return '';
      });
      return data['id'];
    }
    return '';
  }

  async updateConditions(
    assignmentId: string,
    conditions: Condition[],
  ): Promise<string> {
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

    // Những condition sẽ insert/update
    const conditionJson = converConditionFromArrayToJson(conditions);

    // Lấy những conditions đã set trước đó
    const updatedConditionIdJson = {};
    const deletedConditionIdJson = {};

    data.conditions.forEach((condition) => {
      if (conditionJson[`${condition.metric}`] != null) {
        updatedConditionIdJson[`${condition.metric}`] = condition.id;
      } else {
        deletedConditionIdJson[`${condition.metric}`] = condition.id;
      }
    });

    for (let i = 0; i < CONDITION.length; i++) {
      if (updatedConditionIdJson[`${CONDITION[i].key}`] != null) {
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
                  id: updatedConditionIdJson[`${CONDITION[i].key}`],
                  metric: CONDITION[i].key,
                  op: CONDITION[i].op,
                },
              },
            )
            .pipe(),
        ).catch((e) => {
          throw e;
        });
      } else {
        if (deletedConditionIdJson[`${CONDITION[i].key}`] != null) {
          await firstValueFrom(
            this.httpService
              .post(
                `${process.env.SONARQUBE_BASE_URL}/qualitygates/delete_condition`,
                null,
                {
                  auth: {
                    username: process.env.SONARQUBE_USERNAME,
                    password: process.env.SONARQUBE_PASSWORD,
                  },
                  params: {
                    id: deletedConditionIdJson[`${CONDITION[i].key}`],
                  },
                },
              )
              .pipe(),
          ).catch((e) => {
            throw e;
          });
        }
      }
    }

    for (let i = 0; i < conditions.length; i++) {
      if (updatedConditionIdJson[conditions[i].key]) {
        conditions[i].error = null;
      }
    }

    await this.createConditions(assignmentId, conditions).catch((e) => {
      throw e;
    });

    // Call to scanner service to scan all submissions in this assignment
    const submisisons =
      await this.submissionDBService.findSubmissionsByAssigmentId(assignmentId);
    if (submisisons.isOk()) {
      for (let i = 0; i < submisisons.data.length; i++) {
        Logger.log('Sanner submisison: ' + submisisons.data[i].id);
        this.submissionService
          .scanCodes(submisisons.data[i] as any)
          .then((result) => {
            Logger.log(result);
          });
      }
    }

    return 'Update condition successfully';
  }

  async createConditions(assignmentId: string, conditions: Condition[]) {
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
  }
}
