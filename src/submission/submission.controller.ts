import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OperationResult } from 'src/common/operation-result';
import { ValidationErrorFilter } from 'src/common/validate-exception.filter';
import { ValidationPipe } from 'src/common/validation.pipe';
import {
  GetSubmissionsOfAssignmentMoodleIdRequest,
  ScanSubmissionRequest,
  Submission,
} from './interfaces/Submission';
import { SubmissionService } from './submission.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { UsersService } from 'src/users/users.service';
import { ResultService } from 'src/sonarqube/result/result.service';
import { UsersDBService } from 'src/users/usersDB.service';
import { SubmissionDBService } from './submissionDB.service';
import { SubmissionResDto } from './res/submission-res.dto';
import { AssignmentDBService } from 'src/assignment/assignmentDB.service';
import { AssignmentResDto } from 'src/assignment/res/assignment-res.dto';
import { templateSendResultHtml } from 'src/config/templateSendResultHtml';
import { UserResDto } from 'src/users/res/user-res.dto';

@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly service: SubmissionService,
    private readonly submissionDBService: SubmissionDBService,
    private readonly scheduleService: SchedulerService,
    private readonly usersDBService: UsersDBService,
    private readonly resultService: ResultService,
    private readonly assignmentDBService: AssignmentDBService,
  ) {}

  @GrpcMethod('GSubmissionService', 'GetSubmissionsByAssignmentId')
  @UsePipes(new ValidationPipe())
  @UseFilters(new ValidationErrorFilter())
  async getSubmissionsByAssignmentId(
    data: GetSubmissionsOfAssignmentMoodleIdRequest,
    meta: Metadata,
  ): Promise<OperationResult<Submission[]>> {
    return this.service.getSubmissionsByAssignmentId(data.assignmentMoodleId);
  }

  @GrpcMethod('GSubmissionService', 'ScanSubmission')
  async scanSubmission(data: ScanSubmissionRequest, meta: Metadata) {
    data.timemodified = new Date(
      data.timemodified.toString().replace('T', ' '),
    );
    data.createdAt = new Date(data.timemodified.toString().replace('T', ' '));
    data.updatedAt = new Date(data.timemodified.toString().replace('T', ' '));

    this.service.scanCodes(data as any).then(async (result) => {
      if (result.error == '1') {
        return null;
      }
      const user = await this.usersDBService.findOne(UserResDto, data.userId);
      const assignment = await this.assignmentDBService.findOne(
        AssignmentResDto,
        data.assignmentId,
      );
      const resultOverview =
        await this.resultService.getOverviewResultsBySubmissionId(data.id);
      const submissionAfterScan = await this.submissionDBService.findOne(
        SubmissionResDto,
        data.id,
      );
      await this.scheduleService.sendEmail(
        user.data,
        templateSendResultHtml(
          user.data,
          assignment.data.name,
          submissionAfterScan.data.status,
          resultOverview,
        ),
        'Your submission result',
      );
    });
    return null;
  }
}
