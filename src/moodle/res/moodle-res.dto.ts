import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class MoodleResDto extends BaseDto {
  @IsString()
  @Expose()
  host: string;

  @IsString()
  @Expose()
  token: string;
}
