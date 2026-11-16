import type { Response } from 'express';
import type { ApiSuccess, PaginationMeta } from '@puvin/shared-types';

export function ok<T>(res: Response, data: T, status = 200): void {
  const body: ApiSuccess<T> = { data };
  res.status(status).json(body);
}

export function paginated<T>(
  res: Response,
  data: T[],
  meta: Omit<PaginationMeta, 'totalPages'>,
): void {
  const body: ApiSuccess<T[]> = {
    data,
    meta: { ...meta, totalPages: Math.max(1, Math.ceil(meta.total / meta.pageSize)) },
  };
  res.status(200).json(body);
}
