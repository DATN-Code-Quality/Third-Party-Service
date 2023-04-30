export interface History {
  date: Date;
  value: string;
}
export interface Measure {
  metric: string;
  history: History[];
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface Result {
  paging: Paging;
  measures: Measure[];
}

export interface ResultRequest {
  submissionId: string;
  page: number;
  pageSize: number;
}

export interface ResultResponse {
  data: Result;
  error: number;
  message: string;
}
