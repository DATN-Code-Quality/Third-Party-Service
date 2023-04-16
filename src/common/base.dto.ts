import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class BaseDto {
  @IsString()
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}
