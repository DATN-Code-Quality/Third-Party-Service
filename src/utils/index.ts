export const genEndpoint = (path: string, query?: Record<string, any> | null) =>
  `${process.env.MOODLE_BASE_URL}${path}${
    query ? `?${new URLSearchParams(query).toString()}` : ''
  }`;

export const moodleArrayInput = (key: string, values: any[]) => {
  const query: Record<string, any> = {};
  values.forEach((value, index) => {
    query[`${key}[${index}]`] = value;
  });
  return query;
};
