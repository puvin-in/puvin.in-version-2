import { ChangeDetectionStrategy, Component, RESPONSE_INIT, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButton } from '@puvin/ui';
import { SeoService } from '../../core/seo.service';
import { SiteDataService } from '../../core/site-data.service';

@Component({
  selector: 'pv-not-found-page',
  imports: [RouterLink, UiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pv-container flex flex-col items-center py-32 text-center">
      <p class="pv-eyebrow">Error 404</p>
      <h1 class="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        This page doesn't exist.
      </h1>
      <p class="mt-4 max-w-md text-muted">
        The link may be outdated or the page may have moved.
      </p>
      <a uiButton class="mt-8" routerLink="/">Back to home</a>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    // Send a real 404 status during SSR so search engines don't index soft-404s.
    const responseInit = inject(RESPONSE_INIT, { optional: true });
    if (responseInit) responseInit.status = 404;

    const siteData = inject(SiteDataService);
    const seo = inject(SeoService);
    effect(() => {
      const site = siteData.site();
      if (site) seo.apply(site.seo, { title: 'Page not found', path: '/404', noindex: true });
    });
  }
}
