import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { OneToMany } from 'typeorm';

export class CourseResDto extends BaseDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  moodleId: string;

  @IsString()
  @Expose()
  courseMoodleId: string;

  @IsString()
  @Expose()
  startAt: Date;

  @IsString()
  @Expose()
  endAt: Date;

  @IsString()
  @Expose()
  detail: string | null;

  @IsString()
  @Expose()
  summary: string | null;

  @IsString()
  @Expose()
  categoryId: string;

  @Expose()
  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
