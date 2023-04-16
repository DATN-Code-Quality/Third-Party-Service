/* eslint-disable @typescript-eslint/no-empty-function */

import { Submission } from 'src/submission/interfaces/Submission';

export interface ResultObject<T> {
  error: number;
  data: T | string;
}

export const Workflows = {
  ScannerWorkflow: (submisson: Submission): Promise<ResultObject<any>> => {
    return new Promise((resolve, reject) => {});
  },
};

export const TaskQueue = {
  ScannerService: 'scanner-service-task-queue',
};
