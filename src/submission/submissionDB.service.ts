import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import {
  SUBMISSION_ORIGIN,
  SUBMISSION_STATUS,
  SubmissionReqDto,
} from './req/submission-req.dto';
import { SubmissionResDto } from './res/submission-res.dto';
import { OperationResult } from 'src/common/operation-result';

@Injectable()
export class SubmissionDBService extends BaseService<
  SubmissionReqDto,
  SubmissionResDto
> {
  constructor(
    @InjectRepository(SubmissionReqDto)
    private readonly submissionRepository: Repository<SubmissionReqDto>,
  ) {
    super(submissionRepository);
  }

  async findSubmissionsByAssigmentId(
    assignmentId: string,
  ): Promise<OperationResult<Array<SubmissionResDto>>> {
    var result: OperationResult<Array<SubmissionResDto>>;
    await this.submissionRepository
      .createQueryBuilder('submission')
      .where(
        'submission.assignmentId = :assignmentId and submission.deletedAt is null',
        { assignmentId: assignmentId },
      )
      .getMany()
      .then((submissions) => {
        result = OperationResult.ok(
          plainToInstance(SubmissionResDto, submissions, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async findSubmissionsByAssigmentIdAndUserId(
    assignmentId: string,
    userId: string,
  ): Promise<OperationResult<Array<SubmissionResDto>>> {
    var result: OperationResult<Array<SubmissionResDto>>;
    await this.submissionRepository
      .createQueryBuilder('submission')
      .where(
        'submission.assignmentId = :assignmentId and submission.userId = :userId and submission.deletedAt is null',
        { assignmentId: assignmentId, userId: userId },
      )
      .getMany()
      .then((submissions) => {
        result = OperationResult.ok(
          plainToInstance(SubmissionResDto, submissions, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async findSubmissionWithMoodleId(
    moodleId: string,
  ): Promise<OperationResult<SubmissionResDto>> {
    var result: OperationResult<SubmissionResDto>;
    await this.submissionRepository
      .createQueryBuilder('submission')
      .where('submission.submissionMoodleId = :moodleId', { moodleId })
      .getOne()
      .then((submission) => {
        result = OperationResult.ok(
          plainToInstance(SubmissionResDto, submission, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async createOrUpdate(
    submission: SubmissionReqDto,
  ): Promise<OperationResult<SubmissionResDto>> {
    var result: OperationResult<SubmissionResDto>;
    await this.submissionRepository
      .upsert(submission, ['submissionMoodleId'])
      .then((savedSubmission) => {
        result = OperationResult.ok(
          plainToInstance(SubmissionResDto, savedSubmission, {
            excludeExtraneousValues: true,
          }),
        );

        Logger.debug({ savedSubmission, result });
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async createOrUpdateMany(
    submissions: SubmissionReqDto[],
  ): Promise<OperationResult<SubmissionResDto>> {
    var result: OperationResult<SubmissionResDto>;
    await this.submissionRepository
      .upsert(submissions, ['submissionMoodleId'])
      .then((savedSubmission) => {
        result = OperationResult.ok(
          plainToInstance(SubmissionResDto, savedSubmission, {
            excludeExtraneousValues: true,
          }),
        );

        Logger.debug({ savedSubmission, result });
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async updateSubmissionStatus(
    submisisonId: string,
    status: SUBMISSION_STATUS,
  ): Promise<OperationResult<any>> {
    return await this.submissionRepository
      .update(submisisonId, { status: status })
      .then(() => {
        return OperationResult.ok('update status successfully');
      })
      .catch((err) => {
        return OperationResult.error(new Error(err.message));
      });
  }
}
