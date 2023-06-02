export interface ComponentDetail {
  key: string;
  enabled: boolean;
  qualifier: string;
  name: string;
  longName: string;
  path: string;
  uuid: string;
}

export interface TextRange {
  startLine: number;
  endLine: number;
  startOffset: number;
  endOffset: number;
}

export interface RuleOverview {
  key: string;
  lang: string;
  langName: string;
  name: string;
  status: string;
}

export interface IssueDetail {
  key: string;
  rule: string;
  severity: string;
  component: string;
  project: string;
  line: number;
  hash: string;
  textRange: TextRange;
  // flows: object[];
  status: string;
  message: string;
  effort: string;
  debt: string;
  //   tags: string[];
  creationDate: string;
  updateDate: string;
  type: string;
  scope: string;
}

export interface IssueSonarqubeDTO {
  total: number;
  p: number;
  ps: number;
  effortTotal: number;
  issues: IssueDetail[];
  components: ComponentDetail[];
  rules: RuleOverview[];
}

export interface Issue {
  total: number;
  p: number;
  ps: number;
  effortTotal: number;
  issues: IssueDetail[];
  components: ComponentDetail[];
  rules: RuleOverview[];
}

export interface IssueRequest {
  submissionId: string;
  type: string;
  severity: string;
  rule: string;
  file: string;
  fileuuid: string;
  page: number;
  pageSize: number;
}

export interface IssueResponse {
  data: Issue;
  error: number;
  message: string;
}
