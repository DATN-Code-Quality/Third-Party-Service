import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { RulesService } from './rule.service';
import { RuleRequest, RuleResponse } from './interfaces/Rule';

@Controller('rules')
export class RulesController {
  constructor(private readonly ruleService: RulesService) {}

  @GrpcMethod('GRuleService', 'getRuleDetailByKey')
  async getSourcesBySubmissionId(
    data: RuleRequest,
    meta: Metadata,
  ): Promise<RuleResponse> {
    var result: RuleResponse;
    await this.ruleService
      .getRuleDetailByKey(data.key)
      .then((source) => {
        if (source == null) {
          result = {
            message: 'Not find',
            data: null,
            error: 1,
          };
        }
        result = {
          data: source,
          error: 0,
          message: null,
        };
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
