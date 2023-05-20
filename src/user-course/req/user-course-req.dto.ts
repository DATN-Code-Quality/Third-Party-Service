import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { CourseReqDto } from 'src/courses/req/course-req.dto';
import { CourseResDto } from 'src/courses/res/course-res.dto';
import { UserReqDto } from 'src/users/req/user-req.dto';
import { UserResDto } from 'src/users/res/user-res.dto';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('user_course', { schema: 'sonarqube' })
export class UserCourseReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'courseId', length: 255 })
  courseId: string;

  @IsString()
  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @IsString()
  @Column('varchar', { name: 'role', length: 255 })
  role: string;

  @Column('tinyint', { name: 'status', width: 1, nullable: true })
  status: boolean;

  @ManyToOne(() => UserReqDto, (user) => user.userCourses, {})
  user: UserResDto;

  @ManyToOne(() => CourseReqDto, (course) => course.userCourses, {})
  course: CourseResDto;
}
