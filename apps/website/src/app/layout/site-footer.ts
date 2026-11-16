import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteDataService } from '../core/site-data.service';
import { HOME_NAV_LINKS } from './nav-links';

@Component({
  selector: 'pv-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-24 border-t border-border">
      <div class="pv-container grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div class="max-w-sm">
          <p class="font-display text-lg font-bold">{{ site()?.branding?.brandName ?? 'PUVIN' }}</p>
          @if (site(); as s) {
            <p class="mt-2 text-sm text-muted">
              {{ s.profile.displayName }} — {{ s.branding.tagline }}
            </p>
          }
        </div>

        <nav aria-label="Footer">
          <p class="text-sm font-semibold">Explore</p>
          <ul class="mt-3 space-y-2">
            @for (link of links; track link.label) {
              <li>
                <a
                  [href]="link.path"
                  class="text-sm text-muted transition-colors hover:text-text"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
        </nav>

        @if (hasContact()) {
          <div>
            <p class="text-sm font-semibold">Connect</p>
            <ul class="mt-3 space-y-2">
              @if (site()?.profile?.email; as email) {
                <li>
                  <a [href]="'mailto:' + email" class="text-sm text-muted hover:text-text">{{
                    email
                  }}</a>
                </li>
              }
              @for (social of site()?.profile?.social ?? []; track social.url) {
                <li>
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer me"
                    class="text-sm text-muted hover:text-text"
                    >{{ social.label || social.platform }}</a
                  >
                </li>
              }
            </ul>
          </div>
        }
      </div>
      <div class="border-t border-border">
        <p class="pv-container py-6 text-xs text-muted">
          © {{ year }} {{ site()?.profile?.displayName ?? site()?.branding?.brandName ?? 'PUVIN' }}.
          All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly site = inject(SiteDataService).site;
  protected readonly links = HOME_NAV_LINKS;
  protected readonly year = new Date().getFullYear();
  protected readonly hasContact = computed(() => {
    const profile = this.site()?.profile;
    return !!profile && (!!profile.email || profile.social.length > 0);
  });
}
