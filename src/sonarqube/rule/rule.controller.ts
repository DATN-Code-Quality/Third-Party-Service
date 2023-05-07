import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { RulesService } from './rule.service';
import { RuleRequest, RuleResponse } from './interfaces/Rule';

@Controller('rules')
export class RulesController {
  constructor(private readonly ruleService: RulesService) {}

  @GrpcMethod('GRuleService', 'getRuleDetailByKey')
  async getRuleBySubmissionId(
    data: RuleRequest,
    meta: Metadata,
  ): Promise<RuleResponse> {
    return await this.ruleService
      .getRuleDetailByKey(data.key)
      .then((source) => {
        if (source == null) {
          return {
            message: 'No data Found',
            data: null,
            error: 1,
          };
        }
        return {
          data: source,
          error: 0,
          message: null,
        };
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
