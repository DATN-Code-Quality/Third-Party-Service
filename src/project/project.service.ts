import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectReqDto } from './req/project-req.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectReqDto)
    private readonly projectRepository: Repository<ProjectReqDto>,
  ) {}

  async findProjectBySubmissionId(
    submissionId: string,
  ): Promise<ProjectReqDto> {
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
