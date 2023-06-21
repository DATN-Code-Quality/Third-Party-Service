import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('course', { schema: 'sonarqube' })
export class CourseReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  // @IsString()
  @Column('varchar', {
    name: 'moodleId',
    length: 255,
    nullable: true,
    unique: true,
  })
  moodleId: string;

  @Column('varchar', {
    name: 'courseMoodleId',
    length: 255,
    nullable: true,
    unique: true,
  })
  courseMoodleId: string;

  @IsString()
  @Column('datetime', { name: 'startAt' })
  startAt: Date;

  @IsString()
  @Column('datetime', { name: 'endAt' })
  endAt: Date;

  // @IsString()
  @Column('varchar', { name: 'detail', nullable: true, length: 255 })
  detail: string | null;

  // @IsString()
  @Column('varchar', { name: 'summary', nullable: true, length: 255 })
  summary: string | null;

  // @IsString()
  @Column('varchar', { name: 'categoryId', length: 255, nullable: true })
  categoryId: string;

  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
