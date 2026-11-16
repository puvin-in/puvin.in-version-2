import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Check } from 'lucide';
import type { ProfileDto } from '@puvin/shared-types';
import { UiIcon } from '@puvin/ui';
import { SectionHeading } from './section-heading';

@Component({
  selector: 'pv-about-section',
  imports: [UiIcon, SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" aria-labelledby="about-heading" class="pv-container py-20">
      <pv-section-heading
        eyebrow="About me"
        [heading]="profile().headline + ' building the web.'"
        headingId="about-heading"
      />

      <div class="mt-10 grid gap-4 lg:grid-cols-3">
        <div class="pv-card flex flex-col items-start gap-5 p-6 sm:flex-row lg:col-span-2 lg:p-8">
          @if (profile().photoUrl; as photo) {
            <img
              [src]="photo"
              [alt]="'Portrait of ' + profile().displayName"
              width="96"
              height="96"
              class="size-24 shrink-0 rounded-2xl object-cover"
              loading="lazy"
            />
          } @else {
            <span
              aria-hidden="true"
              class="grid size-24 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-accent/30 to-accent-2/30 font-display text-3xl font-bold"
              >{{ initials() }}</span
            >
          }
          <div class="space-y-4 text-base leading-relaxed text-muted">
            @for (paragraph of profile().aboutSummary; track $index) {
              <p>{{ paragraph }}</p>
            }
          </div>
        </div>

        @if (profile().highlights.length) {
          <div class="pv-card p-6 lg:p-8">
            <h3 class="font-display text-lg font-semibold">What I bring</h3>
            <ul class="mt-4 space-y-3">
              @for (item of profile().highlights; track $index) {
                <li class="flex gap-3 text-sm text-muted">
                  <ui-icon [icon]="checkIcon" [size]="18" class="mt-0.5 text-success" />
                  <span>{{ item }}</span>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
})
export class AboutSection {
  readonly profile = input.required<ProfileDto>();
  protected readonly checkIcon = Check;
  protected readonly initials = computed(() =>
    this.profile()
      .displayName.split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
}
