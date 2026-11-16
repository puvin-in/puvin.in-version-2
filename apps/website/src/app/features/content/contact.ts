import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '@puvin/ui';

@Component({
  imports: [FormsModule, UiButton],
  template: `
    <section class="pv-container py-16">
      <div class="mx-auto max-w-xl">
        <h1 class="font-display text-5xl font-bold">Get in touch</h1>
        <form class="pv-card mt-8 grid gap-4 p-6" #form="ngForm" (ngSubmit)="send(form.value)">
          <label>Name <input ngModel name="name" required maxlength="120" autocomplete="name" /></label>
          <label>Email <input ngModel name="email" type="email" email required maxlength="254" autocomplete="email" /></label>
          <label>Subject <input [ngModel]="''" name="subject" maxlength="200" /></label>
          <label>Message <textarea ngModel name="message" required maxlength="5000" rows="6"></textarea></label>
          <label hidden>Website <input [ngModel]="''" name="website" tabindex="-1" autocomplete="off" /></label>
          <button uiButton [disabled]="form.invalid || busy() || sent()">{{ busy() ? 'Sending…' : 'Send message' }}</button>
          @if (sent()) { <p role="status">Thanks. Your message was sent.</p> }
          @if (error()) { <p role="alert">{{ error() }}</p> }
        </form>
      </div>
    </section>
  `,
  styles: `
    input, textarea { display: block; width: 100%; margin-top: .375rem; padding: .625rem .75rem;
      border: 1px solid var(--pv-border); border-radius: .5rem; background: var(--pv-bg); }
  `,
})
export class ContactPage {
  private readonly http = inject(HttpClient);
  protected readonly busy = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  protected send(value: Record<string, string>): void {
    if (this.busy() || this.sent()) return;
    this.busy.set(true);
    this.error.set('');
    this.http.post('/api/v1/public/contact', value).subscribe({
      next: () => { this.sent.set(true); this.busy.set(false); },
      error: response => { this.error.set(response.error?.error?.message ?? 'Unable to send the message. Try again.'); this.busy.set(false); },
    });
  }
}
