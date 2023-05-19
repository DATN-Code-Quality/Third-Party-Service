import { IsDate, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('submission', { schema: 'sonarqube' })
export class SubmissionReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'assignmentId', length: 255 })
  assignmentId: string;

  @IsString()
  @Column('varchar', { name: 'link', length: 255 })
  link: string;

  @IsString()
  @Column('varchar', { name: 'note', nullable: true, length: 255 })
  note: string | null;

  @IsString()
  @Column('varchar', { name: 'submitType', length: 255 })
  submitType: string;

  @IsDate()
  @Column('datetime', { name: 'timemodified' })
  timemodified: Date;

  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @IsString()
  @Column('varchar', { name: 'origin', length: 255 })
  origin: string;

  @IsString()
  @Column('varchar', { name: 'status', length: 255 })
  status: string;

  @IsNumber()
  @Column('float', { name: 'grade', nullable: true, precision: 12 })
  grade: number | null;

  @IsString()
  @Column('varchar', {
    name: 'submissionMoodleId',
    length: 10,
  })
  submissionMoodleId: string;
}
