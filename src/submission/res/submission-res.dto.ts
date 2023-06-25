import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { UserResDto } from 'src/users/res/user-res.dto';
import { Column } from 'typeorm';
import {
  SUBMISSION_ORIGIN,
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
} from '../req/submission-req.dto';

export class SubmissionResDto extends BaseDto {
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
  submitType: SUBMISSION_TYPE;

  @IsDate()
  @Column('datetime', { name: 'timemodified' })
  timemodified: Date;

  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  origin: SUBMISSION_ORIGIN;

  @IsString()
  @Expose()
  status: SUBMISSION_STATUS;

  @IsString()
  @Expose()
  grade: number | null;

  @IsString()
  @Expose()
  submissionMoodleId: string;

  @Expose()
  user: UserResDto;
}
