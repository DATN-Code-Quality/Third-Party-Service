export interface Source {
  line: number;
  code: string;
}

export interface SourceRequest {
  key: string;
}

export interface SourceResponse {
  sources: Source[];
  error: number;
}
