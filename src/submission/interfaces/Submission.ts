export interface Submission {
  assignmentId: string;
  link: string;
  note: string | null;
  submitType: string;
  userId: string;
  origin: string;
  status: string;
  grade: number | null;
  submissionMoodleId: string;
}

export interface SubmissionResponce {
  error: number;
  submissions: Submission[];
}

export interface GetAssignmentsOfAssignmentMoodleIdRequest {
  assignmentMoodleId: string;
}
