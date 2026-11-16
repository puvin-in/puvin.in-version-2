import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'puvin-theme';

/**
 * Dark-first theme state. The choice is stored per visitor in localStorage (a convenience,
 * not a secret). index.html applies it before first paint to avoid a flash.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly mode = signal<ThemeMode>(this.readInitial());

  toggle(): void {
    this.set(this.mode() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    this.document.documentElement.dataset['theme'] = mode;
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // Storage can be unavailable (private mode); the in-memory choice still applies.
      }
    }
  }

  /** Override accent tokens from CMS branding settings. Works during SSR too. */
  applyAccentColors(colors: { accent: string; accent2: string }): void {
    const style = this.document.documentElement.style;
    style.setProperty('--pv-accent', colors.accent);
    style.setProperty('--pv-accent-2', colors.accent2);
  }

  private readInitial(): ThemeMode {
    return this.document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark';
  }
}
