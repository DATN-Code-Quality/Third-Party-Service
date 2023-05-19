import {
  IsDateString,
  IsString
} from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

export interface ConfigObject {
  code_smells?: number;
  bugs?: number;
  vulnerabilities?: number;
  violations?: number;
  blocker_violations?: number;
  critical_violations?: number;
  major_violations?: number;
  minor_violations?: number;
  info_violations?: number;
  duplicated_lines_density?: number;
  coverage?: number;
}

@Entity('assignment', { schema: 'sonarqube' })
export class AssignmentReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  // @IsString()
  @Column('varchar', {
    name: 'assignmentMoodleId',
    length: 10,
    nullable: true,
    unique: true,
  })
  assignmentMoodleId: string;

  @IsDateString()
  @Column('datetime', { name: 'dueDate' })
  dueDate: Date;

  // @IsNumber()
  @Column('tinyint', { name: 'status', width: 1, nullable: true })
  status: boolean;

  @IsString()
  @Column('varchar', { name: 'courseId', length: 255 })
  courseId: string;

  // @IsString()
  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  // @IsString()
  @Column('varchar', {
    name: 'attachmentFileLink',
    nullable: true,
    length: 255,
  })
  attachmentFileLink: string | null;

  //Object:
  configObject: ConfigObject;

  @Column('varchar', { name: 'config', length: 255 })
  config: string;
}
