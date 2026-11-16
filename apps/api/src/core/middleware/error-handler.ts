import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import type { ApiErrorBody } from '@puvin/shared-types';
import { AppError, notFound } from '../errors.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(notFound(`Route ${req.method} ${req.path}`));
};

/** Converts known error types to the API envelope. Unknown errors never leak details. */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const appError = toAppError(err);

  if (appError.status >= 500) {
    req.log.error({ err }, 'Unhandled error');
  }

  const body: ApiErrorBody = {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
      requestId: String(req.id),
    },
  };
  res.status(appError.status).json(body);
};

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (typeof err === 'object' && err !== null && 'code' in err && err.code === 11000) {
    return new AppError(409, 'CONFLICT', 'This slug or email is already in use');
  }

  if (err instanceof ZodError) {
    return new AppError(
      400,
      'VALIDATION_FAILED',
      'The request contains invalid data',
      err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return new AppError(
      400,
      'VALIDATION_FAILED',
      'The request contains invalid data',
      Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
    );
  }

  if (err instanceof mongoose.Error.CastError) {
    return new AppError(400, 'BAD_REQUEST', `Invalid value for ${err.path}`);
  }

  // body-parser / express errors carry an HTTP status and a `type`.
  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = Number((err as { status: unknown }).status);
    const type = (err as { type?: string }).type;
    if (status === 413) return new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
    if (type === 'entity.parse.failed') return new AppError(400, 'BAD_REQUEST', 'Malformed JSON');
    if (status >= 400 && status < 500) return new AppError(status, 'BAD_REQUEST', 'Bad request');
  }

  return new AppError(500, 'INTERNAL_ERROR', 'Something went wrong');
}
