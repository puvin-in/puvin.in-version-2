import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';

interface User { id: string; name: string; email: string; owner: boolean }

@Injectable({ providedIn: 'root' })
export class AdminSession {
  private readonly http = inject(HttpClient);
  readonly user = signal<User | null>(null);
  check() {
    return this.http.get<{ data: User }>('/api/v1/auth/me').pipe(tap(result => this.user.set(result.data)));
  }
  login(input: { email: string; password: string }) {
    return this.http.post<{ data: User }>('/api/v1/auth/login', input).pipe(tap(result => this.user.set(result.data)));
  }
  logout() {
    return this.http.post('/api/v1/auth/logout', {}).pipe(tap(() => this.user.set(null)));
  }
}

export const signedIn: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AdminSession).check().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
