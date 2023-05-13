export interface Condition {
  key: string;
  error: number;
}

export interface QualityGateRequest {
  assignmentId: string;
  conditions: Condition[];
}

export interface QualityGateResponse {
  data: string;
  error: number;
  message: string;
}

export const defaultConfig = {
  conditions: [
    {
      key: 'code_smells',
      error: 0,
    },
    {
      key: 'bugs',
      error: 0,
    },
    {
      key: 'vulnerabilities',
      error: 0,
    },
    {
      key: 'violations',
      error: 0,
    },
    {
      key: 'blocker_violations',
      error: 0,
    },
    {
      key: 'critical_violations',
      error: 0,
    },
    {
      key: 'major_violations',
      error: 0,
    },
    {
      key: 'minor_violations',
      error: 0,
    },
    {
      key: 'info_violations',
      error: 0,
    },
    {
      key: 'duplicated_lines_density',
      error: 0,
    },
    {
      key: 'coverage',
      error: 100,
    },
  ],
};

export const CONDITION = [
  {
    key: 'coverage',
    op: 'LT',
  },
  {
    key: 'duplicated_lines_density',
    op: 'GT',
  },
  {
    key: 'blocker_violations',
    op: 'GT',
  },
  {
    key: 'critical_violations',
    op: 'GT',
  },
  {
    key: 'major_violations',
    op: 'GT',
  },
  {
    key: 'minor_violations',
    op: 'GT',
  },
  {
    key: 'info_violations',
    op: 'GT',
  },
  {
    key: 'violations',
    op: 'GT',
  },
  {
    key: 'code_smells',
    op: 'GT',
  },
  {
    key: 'bugs',
    op: 'GT',
  },
  {
    key: 'vulnerabilities',
    op: 'GT',
  },
];

export function converConditionFromArrayToJson(conditions: Condition[]) {
  const result = {};
  conditions.forEach((condition) => {
    result[`${condition.key}`] = condition.error;
  });

  return result;
}
