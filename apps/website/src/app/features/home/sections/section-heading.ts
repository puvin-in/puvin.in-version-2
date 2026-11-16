import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pv-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="pv-eyebrow">{{ eyebrow() }}</p>
    <h2
      [id]="headingId()"
      class="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
    >
      {{ heading() }}
    </h2>
    @if (lead()) {
      <p class="mt-4 max-w-2xl text-base text-muted">{{ lead() }}</p>
    }
  `,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly headingId = input.required<string>();
  readonly lead = input<string>();
}
