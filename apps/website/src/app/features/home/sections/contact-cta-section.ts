import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Mail } from 'lucide';
import type { HomeContentDto, ProfileDto } from '@puvin/shared-types';
import { UiButton, UiIcon } from '@puvin/ui';

/**
 * Contact call-to-action. Shows only the contact methods the owner has configured;
 * the full contact form arrives with the Contact page in Phase 3.
 */
@Component({
  selector: 'pv-contact-cta-section',
  imports: [UiButton, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" aria-labelledby="contact-heading" class="pv-container py-20">
      <div
        class="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-accent/20 via-surface to-accent-2/10 px-6 py-14 text-center sm:px-12"
      >
        <h2
          id="contact-heading"
          class="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {{ home().contactCta.heading }}
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-muted">{{ home().contactCta.text }}</p>

        @if (profile().email; as email) {
          <div class="mt-8 flex justify-center">
            <a uiButton size="lg" [href]="'mailto:' + email">
              <ui-icon [icon]="mailIcon" [size]="18" /> {{ email }}
            </a>
          </div>
        }
        @if (profile().phone; as phone) {
          <p class="mt-4 text-sm text-muted">
            or call <a class="text-text underline-offset-4 hover:underline" [href]="'tel:' + phone">{{ phone }}</a>
          </p>
        }
      </div>
    </section>
  `,
})
export class ContactCtaSection {
  readonly home = input.required<HomeContentDto>();
  readonly profile = input.required<ProfileDto>();
  protected readonly mailIcon = Mail;
}
