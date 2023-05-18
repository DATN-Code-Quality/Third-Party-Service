import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import {
  QualityGateRequest,
  QualityGateResponse,
} from './interfaces/qualityGate';
import { QualityGateService } from './qualityGate.service';

@Controller('quality gate')
export class QualityGateController {
  constructor(private readonly qualityGateService: QualityGateService) {}

  @GrpcMethod('GSonarqubeService', 'createQualityGate')
  async createQualityGate(
    data: QualityGateRequest,
    meta: Metadata,
  ): Promise<QualityGateResponse> {
    return this.qualityGateService
      .createQualityGate(data.assignmentId, data.conditions)
      .then((key) => {
        if (key) {
          return {
            data: key,
            error: 0,
            message: null,
          };
        } else {
          return {
            message: 'Can not create quality gate',
            data: null,
            error: 1,
          };
        }
      })
      .catch((e) => {
        return {
          message: e,
          data: null,
          error: 1,
        };
      });
  }

  @GrpcMethod('GSonarqubeService', 'updateConditions')
  async updateConditions(
    data: QualityGateRequest,
    meta: Metadata,
  ): Promise<QualityGateResponse> {
    return this.qualityGateService
      .updateConditions(data.assignmentId, data.conditions)
      .then((key) => {
        if (key) {
          return {
            data: key,
            error: 0,
            message: null,
          };
        } else {
          return {
            message: 'Can not update conditions',
            data: null,
            error: 1,
          };
        }
      })
      .catch((e) => {
        return {
          message: e,
          data: null,
          error: 1,
        };
      });
  }
}
