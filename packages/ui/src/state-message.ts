import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Empty and error states share one layout; `tone` sets the colour and live-region role. */
@Component({
  selector: 'ui-state-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-10 text-center"
      [attr.role]="tone() === 'error' ? 'alert' : 'status'"
    >
      <p
        class="font-display text-lg font-semibold"
        [class.text-error]="tone() === 'error'"
        [class.text-text]="tone() !== 'error'"
      >
        {{ heading() }}
      </p>
      @if (message()) {
        <p class="max-w-md text-sm text-muted">{{ message() }}</p>
      }
      @if (actionLabel()) {
        <button
          type="button"
          class="mt-2 rounded-[10px] border border-border px-4 py-2 text-sm hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-2"
          (click)="action.emit()"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class UiStateMessage {
  readonly heading = input.required<string>();
  readonly message = input<string>();
  readonly tone = input<'empty' | 'error'>('empty');
  readonly actionLabel = input<string>();
  readonly action = output<void>();
}
