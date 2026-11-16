import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Moon, Sun } from 'lucide';
import { ThemeService, UiIcon } from '@puvin/ui';

@Component({
  selector: 'pv-theme-toggle',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="grid size-11 place-items-center rounded-[10px] text-muted transition-colors hover:bg-surface-2 hover:text-text"
      [attr.aria-label]="label()"
      [attr.aria-pressed]="theme.mode() === 'light'"
      (click)="theme.toggle()"
    >
      <ui-icon [icon]="theme.mode() === 'dark' ? sun : moon" [size]="18" />
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly sun = Sun;
  protected readonly moon = Moon;
  protected readonly label = computed(() =>
    this.theme.mode() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );
}
