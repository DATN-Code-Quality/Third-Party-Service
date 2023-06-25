import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { AssignmentReqDto } from './req/assignment-req.dto';
import { AssignmentResDto } from './res/assignment-res.dto';

@Injectable()
export class AssignmentDBService extends BaseService<
  AssignmentReqDto,
  AssignmentResDto
> {
  constructor(
    @InjectRepository(AssignmentReqDto)
    private readonly assignmentRepository: Repository<AssignmentReqDto>,
  ) {
    super(assignmentRepository);
  }

  async findAssignmentsByCourseId(
    courseId: string,
  ): Promise<OperationResult<Array<AssignmentResDto>>> {
    let result: OperationResult<Array<AssignmentResDto>>;

    await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where(
        'assignment.courseId = :courseId and assignment.deletedAt is null',
        { courseId: courseId },
      )
      .getMany()
      .then((assignments) => {
        result = OperationResult.ok(
          plainToInstance(AssignmentResDto, assignments, {
            excludeExtraneousValues: true,
          }),
        );
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async findAssignmentById(
    assigmentId: string,
  ): Promise<OperationResult<AssignmentResDto>> {
    let result: OperationResult<AssignmentResDto>;
    await this.assignmentRepository
      .createQueryBuilder('user')
      .where('assignment.id = :assigmentId', {
        id: assigmentId,
      })
      .getOne()
      .then((savedDtos) => {
        result = OperationResult.ok(savedDtos);
      })
      .catch((err) => {
        result = OperationResult.error(err);
      });
    return result;
  }

  async upsertAssignments(assignments: AssignmentReqDto[]) {
    const moodleIds = assignments.map((assignment) => {
      return assignment.assignmentMoodleId;
    });

    const savedAssignments = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .where(
        'assignment.assignmentMoodleId IN (:...moodleIds) and assignment.deletedAt is null',
        {
          moodleIds: moodleIds,
        },
      )
      .getMany()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return [];
      });

    const insertAssignments = [];
    const updatedAssignmentIds = [];

    for (let j = 0; j < assignments.length; j++) {
      let isExist = false;
      for (let i = 0; i < savedAssignments.length; i++) {
        if (
          assignments[j].assignmentMoodleId ==
          savedAssignments[i].assignmentMoodleId
        ) {
          await this.assignmentRepository
            .update(savedAssignments[i].id, assignments[j])
            .catch((e) => {
              return OperationResult.error(
                new Error(`Can not import assignments: ${e.message}`),
              );
            });
          isExist = true;
          updatedAssignmentIds.push(savedAssignments[i].id);
          break;
        }
      }
      if (!isExist) {
        insertAssignments.push(assignments[j]);
      }
    }

    const insertResult = await this.createMany(
      AssignmentResDto,
      insertAssignments,
    );

    if (insertResult.isOk()) {
      if (updatedAssignmentIds.length > 0) {
        return this.assignmentRepository
          .createQueryBuilder('assignment')
          .where(
            'assignment.id IN (:...ids) and assignment.deletedAt is null',
            {
              ids: updatedAssignmentIds,
            },
          )
          .getMany()
          .then((upsertedAssignments) => {
            insertResult.data.forEach((assignment) => {
              upsertedAssignments.push(assignment);
            });
            return OperationResult.ok(
              plainToInstance(AssignmentResDto, upsertedAssignments, {
                excludeExtraneousValues: true,
              }),
            );
          })
          .catch((e) => {
            return OperationResult.error(new Error(e));
          });
      } else {
        return insertResult;
      }
    } else {
      return OperationResult.error(
        new Error(`Can not import assignments: ${insertResult.message}`),
      );
    }
  }
}
