import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class AssignmentResDto extends BaseDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  dueDate: Date;

  @IsString()
  @Expose()
  status: boolean;

  @IsString()
  @Expose()
  courseId: string;

  @IsString()
  @Expose()
  assignmentMoodleId: string;

  @IsString()
  @Expose()
  description: string | null;

  @IsString()
  @Expose()
  attachmentFileLink: string | null;

  @IsString()
  @Expose() 
  config: string;
}
