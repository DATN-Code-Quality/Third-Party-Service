import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { SubmissionReqDto } from 'src/submission/req/submission-req.dto';
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { Column, Entity, OneToMany } from 'typeorm';

export enum USER_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCK = 2,
}

@Entity('user', { schema: 'sonarqube' })
export class UserReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @IsString()
  @Column('varchar', { name: 'role', length: 20 })
  role: string;

  @IsString()
  @Column('varchar', { name: 'email', length: 50, unique: true })
  email: string;

  @IsString()
  @Column('varchar', { name: 'userId', length: 20, unique: true })
  userId: string;

  @Column('varchar', {
    name: 'moodleId',
    length: 255,
    nullable: true,
    unique: true,
  })
  moodleId: string;

  @IsOptional()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('tinyint', { name: 'status', width: 1 })
  status: USER_STATUS;

  @OneToMany(() => SubmissionReqDto, (submission) => submission.user)
  submissions: SubmissionReqDto[];

  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
