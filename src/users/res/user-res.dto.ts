import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { UserCourseReqDto } from 'src/user-course/req/user-course-req.dto';
import { OneToMany } from 'typeorm';
import { USER_STATUS } from '../req/user-req.dto';

export class UserResDto extends BaseDto {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  role: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  moodleId: string;

  @IsString()
  @Expose()
  status: USER_STATUS;

  @Expose()
  @OneToMany(() => UserCourseReqDto, (userCourse) => userCourse.user)
  userCourses: UserCourseReqDto[];
}
