import { IsNumber, MIN, Min } from 'class-validator';

export interface CourseModelDTO {
  id: number;
  shortname: string;
  fullname: string;
  displayname: string;
  enrolledusercount: number;
  idnumber: string;
  visible: number;
  summary: string;
  summaryformat: number;
  format: string;
  showgrades: boolean;
  lang: string;
  enablecompletion: boolean;
  completionhascriteria: boolean;
  completionusertracked: boolean;
  category: number;
  completed: boolean;
  startdate: number;
  enddate: number;
  marker: number;
  lastaccess: number;
  isfavourite: boolean;
  hidden: boolean;
  overviewfiles: [];
  showactivitydates: boolean;
  showcompletionconditions: boolean;
}

export interface Course {
  name: string;
  moodleId: string;
  courseMoodleId: string;
  startAt: string;
  endAt: string;
  detail: string | null;
  summary: string | null;
  categoryId: string;
}

export class GetCourseOfUserRequest {
  @IsNumber()
  @Min(1)
  userMoodleId: number;
}

export class GetCourseOfCategoryRequest {
  @IsNumber()
  @Min(1)
  categoryMoodleId: number;
}

export class GetCourseOfMoodleIdRequest {
  @IsNumber()
  @Min(1)
  courseMoodleId: number;
}

export interface CoursesResponce {
  error: number;
  data: Course[];
}
