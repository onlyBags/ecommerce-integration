export interface FieldErrors {
  [name: string]: { message: string; value?: any };
}

export interface Exception extends Error {
  status: number;
}

export class ValidateError extends Error implements Exception {
  public status = 400;
  public name = 'ValidateError';

  constructor(public fields: FieldErrors, public message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidateError.prototype);
  }
}
