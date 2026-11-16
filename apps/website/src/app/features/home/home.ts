import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { UiSkeleton, UiStateMessage } from '@puvin/ui';
import { SeoService } from '../../core/seo.service';
import { SiteDataService } from '../../core/site-data.service';
import { AboutSection } from './sections/about-section';
import { ContactCtaSection } from './sections/contact-cta-section';
import { HeroSection } from './sections/hero-section';
import { ProcessSection } from './sections/process-section';
import { ServicesSection } from './sections/services-section';
import { SkillsSection } from './sections/skills-section';

@Component({
  selector: 'pv-home-page',
  imports: [
    UiSkeleton,
    UiStateMessage,
    HeroSection,
    AboutSection,
    SkillsSection,
    ServicesSection,
    ProcessSection,
    ContactCtaSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (siteData.site(); as site) {
      <pv-hero-section [site]="site" />
      <pv-about-section [profile]="site.profile" />
      @if (site.skills.length) {
        <pv-skills-section [skills]="site.skills" />
      }
      @if (site.services.length) {
        <pv-services-section [services]="site.services" />
      }
      @if (site.home.process.length) {
        <pv-process-section [steps]="site.home.process" />
      }
      <pv-contact-cta-section [home]="site.home" [profile]="site.profile" />
    } @else if (siteData.error()) {
      <div class="pv-container py-24">
        <ui-state-message
          tone="error"
          heading="This page could not be loaded"
          message="Please check your connection and try again."
          actionLabel="Try again"
          (action)="siteData.reload()"
        />
      </div>
    } @else {
      <div class="pv-container space-y-6 py-24" aria-busy="true" aria-label="Loading">
        <ui-skeleton height="1.25rem" width="12rem" />
        <ui-skeleton height="4rem" width="80%" />
        <ui-skeleton height="1rem" width="60%" />
      </div>
    }
  `,
})
export class HomePage {
  protected readonly siteData = inject(SiteDataService);

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const site = this.siteData.site();
      if (site) seo.apply(site.seo, { path: '/' });
    });
  }
}
