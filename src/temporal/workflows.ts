/* eslint-disable @typescript-eslint/no-empty-function */

import { Submission } from './interfaces';
import { ResultObject } from './interfaces/result.interface';

export const Workflows = {
  ScannerWorkflow: (submisson: Submission): Promise<ResultObject<any>> => {
    return new Promise((resolve, reject) => {});
  },
};

export const TaskQueue = {
  ScannerService: 'scanner-service-task-queue',
};
