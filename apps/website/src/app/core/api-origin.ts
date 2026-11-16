import { InjectionToken, inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';

/**
 * Origin used to reach the API. Null in the browser, where `/api/...` is same-origin
 * (nginx in production, the dev-server proxy locally). During SSR it is the internal
 * API address, because the SSR server does not serve `/api` itself.
 */
export const API_ORIGIN = new InjectionToken<string | null>('API_ORIGIN', {
  providedIn: 'root',
  factory: () => null,
});

export const apiOriginInterceptor: HttpInterceptorFn = (req, next) => {
  const origin = inject(API_ORIGIN);
  if (!origin || !req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ url: `${origin}${req.url}` }));
};
