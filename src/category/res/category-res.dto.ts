import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class CategoryResDto extends BaseDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  categoryMoodleId: string;
}
