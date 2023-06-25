import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { MoodleReqDto } from './req/moodle-req.dto';
import { MoodleResDto } from './res/moodle-res.dto';
import { OperationResult } from 'src/common/operation-result';

@Injectable()
export class MoodleDBService extends BaseService<MoodleReqDto, MoodleResDto> {
  constructor(
    @InjectRepository(MoodleReqDto)
    private readonly moodleRepository: Repository<MoodleReqDto>,
  ) {
    super(moodleRepository);
  }

  async getMoodleInfo(): Promise<OperationResult<MoodleResDto | any>> {
    return await this.moodleRepository
      .createQueryBuilder('moodle')
      .getMany()
      .then((savedDtos) => {
        return OperationResult.ok(savedDtos);
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }
}
