import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ServiceSummaryDto } from '@puvin/shared-types';
import { UiIcon } from '@puvin/ui';
import { RouterLink } from '@angular/router';
import { cmsIcon } from '../../../core/icons';
import { SectionHeading } from './section-heading';

@Component({
  selector: 'pv-services-section',
  imports: [UiIcon, SectionHeading, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="services" aria-labelledby="services-heading" class="pv-container py-20">
      <pv-section-heading
        eyebrow="Services"
        heading="What I can build for you."
        headingId="services-heading"
      />
      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (service of services(); track service.id) {
          <li class="pv-card pv-card-interactive p-6">
            <span
              class="grid size-11 place-items-center rounded-xl bg-accent/15 text-accent-2"
              aria-hidden="true"
            >
              <ui-icon [icon]="icon(service.icon)" [size]="22" />
            </span>
            <h3 class="mt-5 font-display text-lg font-semibold"><a [routerLink]="['/services', service.slug]">{{ service.title }}</a></h3>
            @if (service.summary) {
              <p class="mt-2 text-sm leading-relaxed text-muted">{{ service.summary }}</p>
            }
          </li>
        }
      </ul>
    </section>
  `,
})
export class ServicesSection {
  readonly services = input.required<ServiceSummaryDto[]>();
  protected readonly icon = cmsIcon;
}
