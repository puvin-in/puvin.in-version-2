import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@puvin/ui';
import { SiteDataService } from './core/site-data.service';
import { SiteHeader } from './layout/site-header';
import { SiteFooter } from './layout/site-footer';

@Component({
  selector: 'pv-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pv-site-header />
    <main id="main" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <pv-site-footer />
  `,
})
export class App {
  constructor() {
    const theme = inject(ThemeService);
    const site = inject(SiteDataService);
    effect(() => {
      const colors = site.site()?.branding.colors;
      if (colors) theme.applyAccentColors(colors);
    });
  }
}
