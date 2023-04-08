export interface SourceLine {
  line: number;
  code: string;
}

export interface Sources{
  sources:SourceLine[];
}

export interface SourceRequest {
  key: string;
}

export interface SourceResponse {
  sources: Sources;
  error: number;
}

