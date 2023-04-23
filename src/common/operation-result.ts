export enum ResultStatus {
  OK,
  FAIL,
  ERROR,
  NOT_AUTHORIZED,
  NOT_FOUND,
  INVALID_INPUT,
}

export class OperationResult<D> {
  constructor(
    public readonly error: ResultStatus,
    public readonly data?: D,
    public readonly message?: string,
  ) {}

  isOk() {
    return this.error === ResultStatus.OK;
  }

  isFail() {
    return this.error === ResultStatus.FAIL;
  }

  isNotAuthorized() {
    return this.error === ResultStatus.NOT_AUTHORIZED;
  }

  isInValidInput() {
    return this.error === ResultStatus.INVALID_INPUT;
  }

  isError() {
    return this.error === ResultStatus.ERROR;
  }

  static ok<D>(data?: D) {
    return new OperationResult(ResultStatus.OK, data);
  }

  static fail<D>(error: Error) {
    return new OperationResult<D>(
      ResultStatus.FAIL,
      (error as any).data,
      error.message,
    );
  }

  static error<D>(error: Error, data?: D) {
    return new OperationResult(ResultStatus.ERROR, data, error.message);
  }
}
