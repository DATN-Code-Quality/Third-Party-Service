import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { PROJECT_TYPE } from '../req/project-req.dto';

export class ProjectResDto extends BaseDto {
  @IsString()
  @Expose()
  key: string;

  @IsString()
  @Expose()
  submissionId: string | null;

  @IsString()
  @Expose()
  userId: string;

  @Expose()
  type: PROJECT_TYPE;
}
