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
    return await this.projectRepository
      .createQueryBuilder('project')
      .where('project.submissionId = :submissionId', {
        submissionId: submissionId,
      })
      .getOne()
      .then((project) => {
        return project;
      })
      .catch((err) => {
        return null;
      });
  }
}
