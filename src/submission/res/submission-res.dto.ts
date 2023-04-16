import { Expose } from "class-transformer";
import { IsString } from 'class-validator';
import { BaseDto } from "src/common/base.dto";

export class SubmissionResDto extends BaseDto{
  @IsString()
  @Expose()
  assignmentId: string;

  @IsString()
  @Expose()
  link: string;

  @IsString()
  @Expose()
  note: string | null;

  @IsString()
  @Expose()
  submitType: string;

  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  origin: string;

  @IsString()
  @Expose()
  status: string;

  @IsString()
  @Expose()
  grade: number | null;

  @IsString()
  @Expose()
  submissionMoodleId: string;
}
