import type { ApiErrorCode, ApiErrorDetail } from '@puvin/shared-types';

/** An error that is safe to show to the client as-is. Anything else becomes a generic 500. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (what = 'Resource') => new AppError(404, 'NOT_FOUND', `${what} not found`);

export const validationFailed = (details: ApiErrorDetail[]) =>
  new AppError(400, 'VALIDATION_FAILED', 'The request contains invalid data', details);
