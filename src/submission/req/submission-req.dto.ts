import { IsDate, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { UserReqDto } from 'src/users/req/user-req.dto';
import { UserResDto } from 'src/users/res/user-res.dto';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum SUBMISSION_STATUS {
  SUBMITTED = 0,
  SCANNING = 1,
  SCANNED_FAIL = 2,
  PASS = 3,
  FAIL = 4,
}

export enum SUBMISSION_TYPE {
  FILE = 'FILE',
  LINK = 'LINK',
}

export enum SUBMISSION_ORIGIN {
  GIT = 'GIT',
  DRIVE = 'DRIVE',
  SYSTEM = 'SYSTEM',
  MOODLE = 'MOODLE',
}

@Entity('submission', { schema: 'sonarqube' })
export class SubmissionReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'assignmentId', length: 255 })
  assignmentId: string;

  @IsString()
  @Column('varchar', { name: 'link', length: 255 })
  link: string;

  @Column('varchar', { name: 'note', nullable: true, length: 255 })
  note: string | null;

  @IsString()
  @Column('varchar', { name: 'submitType', length: 255 })
  submitType: SUBMISSION_TYPE;

  @IsDate()
  @Column('datetime', { name: 'timemodified' })
  timemodified: Date;

  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @IsString()
  @Column('varchar', { name: 'origin', length: 255 })
  origin: SUBMISSION_ORIGIN;

  @Column('tinyint', { name: 'status', width: 1 })
  status: SUBMISSION_STATUS;

  @IsNumber()
  @Column('float', { name: 'grade', nullable: true, precision: 12 })
  grade: number | null;

  @Column('varchar', {
    name: 'submissionMoodleId',
    length: 10,
    nullable: true,
    unique: true,
  })
  submissionMoodleId: string;

  @ManyToOne(() => UserReqDto, (user) => user.userCourses, {})
  user: UserResDto;
}
