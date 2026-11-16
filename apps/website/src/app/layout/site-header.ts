import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu, X } from 'lucide';
import { UiButton, UiIcon } from '@puvin/ui';
import { SiteDataService } from '../core/site-data.service';
import { HOME_NAV_LINKS } from './nav-links';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'pv-site-header',
  imports: [RouterLink, UiButton, UiIcon, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
  template: `
    <header class="sticky top-0 z-40 border-b border-border bg-bg/75 backdrop-blur-xl">
      <div class="pv-container flex h-16 items-center justify-between gap-4">
        <a href="/" class="group flex items-center gap-2.5" (click)="menuOpen.set(false)">
          <span
            aria-hidden="true"
            class="grid size-8 place-items-center rounded-lg bg-linear-to-br from-accent to-accent-2 font-display text-sm font-bold text-white"
            >{{ brandInitial() }}</span
          >
          <span class="font-display text-lg font-bold tracking-tight">{{ brandName() }}</span>
        </a>

        <nav aria-label="Primary" class="hidden md:block">
          <ul class="flex items-center gap-1">
            @for (link of links; track link.label) {
              <li>
                <a
                  [href]="link.path"
                  class="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-text"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
        </nav>

        <div class="flex items-center gap-1">
          <pv-theme-toggle />
          <a uiButton size="sm" routerLink="/contact" class="ml-2 hidden sm:inline-flex"
            >Hire Me</a
          >
          <button
            type="button"
            class="grid size-11 place-items-center rounded-[10px] hover:bg-surface-2 md:hidden"
            aria-controls="mobile-menu"
            [attr.aria-expanded]="menuOpen()"
            [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
            (click)="menuOpen.update((open) => !open)"
          >
            <ui-icon [icon]="menuOpen() ? closeIcon : menuIcon" />
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <nav id="mobile-menu" aria-label="Mobile" class="border-t border-border md:hidden">
          <ul class="pv-container flex flex-col py-3">
            @for (link of links; track link.label) {
              <li>
                <a
                  [href]="link.path"
                  class="flex min-h-11 items-center rounded-lg px-3 text-base text-muted hover:bg-surface-2 hover:text-text"
                  (click)="menuOpen.set(false)"
                  >{{ link.label }}</a
                >
              </li>
            }
          </ul>
        </nav>
      }
    </header>
  `,
})
export class SiteHeader {
  private readonly siteData = inject(SiteDataService);

  protected readonly links = HOME_NAV_LINKS;
  protected readonly menuOpen = signal(false);
  protected readonly menuIcon = Menu;
  protected readonly closeIcon = X;

  protected brandName(): string {
    return this.siteData.site()?.branding.brandName ?? 'PUVIN';
  }

  protected brandInitial(): string {
    return this.brandName().charAt(0).toUpperCase();
  }
}
