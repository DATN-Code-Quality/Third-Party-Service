import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { ComponentService } from './component.service';
import { ComponentRequest, ComponentResponse } from './interfaces/Component';

@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @GrpcMethod('GSonarqubeService', 'getComponentsBySubmissionId')
  async getComponentsBySubmissionId(
    data: ComponentRequest,
    meta: Metadata,
  ): Promise<ComponentResponse> {
    var result: ComponentResponse;
    await this.componentService
      .getComponentsBySubmissionId(data.submissionId)
      .then((component) => {
        if (component) {
          result = {
            data: component,
            error: 0,
            message: null,
          };
        } else {
          result = {
            message: 'No data Found',
            data: null,
            error: 1,
          };
        }
      })
      .catch((e) => {
        result = {
          message: e,
          data: null,
          error: 1,
        };
      });

    return result;
  }
}
