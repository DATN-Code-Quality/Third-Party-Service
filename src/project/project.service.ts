import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDto } from './req/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectDto)
    private readonly projectRepository: Repository<ProjectDto>,
  ) {}

  async findProjectBySubmissionId(submissionId: string): Promise<ProjectDto> {
    var result: ProjectDto;
    await this.projectRepository
      .createQueryBuilder('project')
      .where(
        'project.submissionId = :submissionId and project.deletedAt is null',
        {
          submissionId: submissionId,
        },
      )
      .getOne()
      .then((project) => {
        result = project;
      })
      .catch((err) => {
        result = null;
      });
    return result;
  }
}
