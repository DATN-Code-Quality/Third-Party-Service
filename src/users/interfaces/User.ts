export interface UserMoodelDTO {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department: string;
  firstaccess: number;
  lastaccess: number;
  auth: string;
  suspended: boolean;
  confirmed: boolean;
  mailformat: number;
  description: string;
  descriptionformat: number;
  profileimageurlsmall: string;
  profileimageurl: string;
}

export interface User {
  name: string;
  role: string;
  email: string;
  userId: string;
  moodleId: string;
  password: string;
  status: USER_STATUS;
}

export interface UserRequest {
  emails: string[];
}

export interface UserResponse {
  data: User[];
  error: number;
}

export enum USER_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCK = 2,
}
