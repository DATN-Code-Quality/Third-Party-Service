import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { OperationResult } from 'src/common/operation-result';
import { Repository } from 'typeorm';
import { UserReqDto } from './req/user-req.dto';
import { UserResDto } from './res/user-res.dto';

@Injectable()
export class UsersDBService extends BaseService<UserReqDto, UserResDto> {
  constructor(
    @InjectRepository(UserReqDto)
    private readonly userRepository: Repository<UserReqDto>, // @Inject(UsersCoursesService) private readonly usersCoursesService: UsersCoursesService,
  ) {
    super(userRepository);
  }

  async findUserByMoodleId(
    moodleId: string,
  ): Promise<OperationResult<UserResDto | any>> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.moodleId = :moodleId', {
        moodleId,
      })
      .getOne()
      .then((savedDtos) => {
        return OperationResult.ok(savedDtos);
      })
      .catch((err) => {
        return OperationResult.error(err);
      });
  }
}
