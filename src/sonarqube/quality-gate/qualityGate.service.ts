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
import { SUBMISSION_STATUS } from 'src/submission/req/submission-req.dto';
import { ProjectService } from 'src/project/project.service';
import { PROJECT_TYPE } from 'src/project/req/project-req.dto';
import { ResultService } from '../result/result.service';

@Injectable()
export class QualityGateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly submissionDBService: SubmissionDBService,
    private readonly submissionService: SubmissionService,
    private readonly projectService: ProjectService,
    private readonly resultService: ResultService,
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
        if (
          submisisons.data[i].status === SUBMISSION_STATUS.FAIL ||
          submisisons.data[i].status === SUBMISSION_STATUS.PASS
        ) {
          this.updateSubmisisonStatus(submisisons.data[i].id, conditionJson);
        }
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

  async updateSubmisisonStatus(submisisonId: string, conditionsJson: object) {
    const result = await this.resultService.getResultsBySubmissionId(
      submisisonId,
      null,
      null,
    );
    const length = result.paging.total;

    for (let i = 0; i < result['measures'].length; i++) {
      const metric = result.measures[i].metric;
      const value = result.measures[i].history[length - 1].value;

      if (conditionsJson[metric]) {
        if (
          (metric === 'coverage' && value < conditionsJson[metric]) ||
          (metric !== 'coverage' && value > conditionsJson[metric])
        ) {
          this.submissionDBService.updateSubmissionStatus(
            submisisonId,
            SUBMISSION_STATUS.FAIL,
          );
        } else {
          this.submissionDBService.updateSubmissionStatus(
            submisisonId,
            SUBMISSION_STATUS.PASS,
          );
        }
      }
    }
  }
}
