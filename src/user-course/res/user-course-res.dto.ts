import { Expose } from 'class-transformer';
import { IsBooleanString, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { CourseResDto } from 'src/courses/res/course-res.dto';
import { UserResDto } from 'src/users/res/user-res.dto';

export class UserCourseResDto extends BaseDto {
  @IsString()
  @Expose()
  courseId: string;

  @IsString()
  @Expose()
  userId: string;

  @IsString()
  @Expose()
  role: string;

  @IsBooleanString()
  @Expose()
  status: boolean;

  @Expose()
  user: UserResDto;

  @Expose()
  course: CourseResDto;
}
