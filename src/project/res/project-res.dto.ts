import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

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
}
