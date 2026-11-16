import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButton } from '@puvin/ui';
import { AdminSession } from './session';

@Component({
  imports: [FormsModule, UiButton],
  template: `
    <main class="grid min-h-dvh place-items-center p-5">
      <form class="pv-card grid w-full max-w-md gap-5 p-8" #form="ngForm" (ngSubmit)="login(form.value)">
        <p class="pv-eyebrow">PUVIN Admin</p>
        <h1 class="font-display text-3xl font-bold">Sign in</h1>
        <label>Email <input ngModel name="email" type="email" email required autocomplete="username" /></label>
        <label>Password <input ngModel name="password" type="password" required autocomplete="current-password" /></label>
        <button uiButton [disabled]="form.invalid || busy()">{{ busy() ? 'Signing in…' : 'Sign in' }}</button>
        @if (error()) { <p role="alert">{{ error() }}</p> }
      </form>
    </main>
  `,
})
export class LoginPage {
  private readonly session = inject(AdminSession);
  private readonly router = inject(Router);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected login(input: { email: string; password: string }) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.session.login(input).subscribe({
      next: () => void this.router.navigateByUrl('/'),
      error: response => {
        this.busy.set(false);
        this.error.set(response.error?.error?.message ?? 'Unable to sign in. Try again.');
      },
    });
  }
}
