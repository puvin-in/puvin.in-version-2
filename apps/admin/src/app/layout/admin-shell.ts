import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  ExternalLink,
  LayoutDashboard,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  type IconNode,
} from 'lucide';
import { ThemeService, UiIcon } from '@puvin/ui';

interface NavItem {
  label: string;
  path: string;
  icon: IconNode;
}

/**
 * Only modules that actually work are listed. Each phase adds its own entries
 * (Content, Portfolio, Media … per docs/BLUEPRINT.md §7).
 */
const NAV: NavItem[] = [{ label: 'Dashboard', path: '/', icon: LayoutDashboard }];

@Component({
  selector: 'pva-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'mobileOpen.set(false)' },
  template: `
    <div class="flex min-h-dvh">
      <!-- Mobile backdrop -->
      @if (mobileOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close navigation"
          (click)="mobileOpen.set(false)"
        ></button>
      }

      <aside
        id="admin-sidebar"
        class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface transition-[width,transform] duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0"
        [class.w-64]="!collapsed()"
        [class.w-[72px]]="collapsed()"
        [class.-translate-x-full]="!mobileOpen()"
        [class.translate-x-0]="mobileOpen()"
        aria-label="Admin navigation"
      >
        <div class="flex h-16 items-center gap-2.5 border-b border-border px-4">
          <span
            aria-hidden="true"
            class="grid size-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-accent to-accent-2 font-display text-sm font-bold text-white"
            >P</span
          >
          @if (!collapsed()) {
            <span class="font-display font-bold tracking-tight">PUVIN <span class="font-normal text-muted">Admin</span></span>
          }
        </div>

        <nav class="flex-1 overflow-y-auto p-3">
          <ul class="space-y-1">
            @for (item of nav; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-accent/15 text-text"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  [attr.title]="collapsed() ? item.label : null"
                  (click)="mobileOpen.set(false)"
                >
                  <ui-icon [icon]="item.icon" [size]="18" />
                  @if (!collapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </a>
              </li>
            }
          </ul>
        </nav>

        <div class="hidden border-t border-border p-3 lg:block">
          <button
            type="button"
            class="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-sm text-muted hover:bg-surface-2 hover:text-text"
            [attr.aria-expanded]="!collapsed()"
            aria-controls="admin-sidebar"
            (click)="collapsed.update((c) => !c)"
          >
            <ui-icon [icon]="collapsed() ? expandIcon : collapseIcon" [size]="18" />
            @if (!collapsed()) {
              <span>Collapse</span>
            }
            <span class="sr-only">{{ collapsed() ? 'Expand sidebar' : '' }}</span>
          </button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-xl sm:px-6"
        >
          <button
            type="button"
            class="grid size-11 place-items-center rounded-[10px] hover:bg-surface-2 lg:hidden"
            aria-controls="admin-sidebar"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Open navigation"
            (click)="mobileOpen.set(true)"
          >
            <ui-icon [icon]="menuIcon" />
          </button>
          <div class="flex-1"></div>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            class="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-3 text-sm text-muted hover:bg-surface-2 hover:text-text"
          >
            View site <ui-icon [icon]="externalIcon" [size]="16" />
          </a>
          <button
            type="button"
            class="grid size-11 place-items-center rounded-[10px] text-muted hover:bg-surface-2 hover:text-text"
            [attr.aria-label]="theme.mode() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            (click)="theme.toggle()"
          >
            <ui-icon [icon]="theme.mode() === 'dark' ? sunIcon : moonIcon" [size]="18" />
          </button>
        </header>

        <main class="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShell {
  protected readonly theme = inject(ThemeService);
  protected readonly nav = NAV;
  protected readonly collapsed = signal(false);
  protected readonly mobileOpen = signal(false);

  protected readonly menuIcon = Menu;
  protected readonly collapseIcon = PanelLeftClose;
  protected readonly expandIcon = PanelLeftOpen;
  protected readonly externalIcon = ExternalLink;
  protected readonly sunIcon = Sun;
  protected readonly moonIcon = Moon;
}
