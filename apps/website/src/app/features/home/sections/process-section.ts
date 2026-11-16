import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ProcessStep } from '@puvin/shared-types';
import { SectionHeading } from './section-heading';

@Component({
  selector: 'pv-process-section',
  imports: [SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="process" aria-labelledby="process-heading" class="pv-container py-20">
      <pv-section-heading
        eyebrow="Development process"
        heading="How I bring your ideas to life."
        headingId="process-heading"
      />
      <ol class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        @for (step of steps(); track $index; let i = $index) {
          <li class="pv-card relative p-5">
            <span class="font-mono text-xs text-accent-2">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <h3 class="mt-2 font-display text-base font-semibold">{{ step.title }}</h3>
            @if (step.description) {
              <p class="mt-2 text-sm text-muted">{{ step.description }}</p>
            }
          </li>
        }
      </ol>
    </section>
  `,
})
export class ProcessSection {
  readonly steps = input.required<ProcessStep[]>();
}
