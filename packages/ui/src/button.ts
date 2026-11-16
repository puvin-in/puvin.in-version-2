import { Directive, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 select-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90 shadow-[0_8px_30px_-12px_var(--pv-accent)]',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-2',
  ghost: 'text-text hover:bg-surface-2',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/** Styles a native `<a>` or `<button>` so semantics and keyboard behaviour stay native. */
@Directive({
  selector: 'a[uiButton], button[uiButton]',
  host: { '[class]': 'classes()' },
})
export class UiButton {
  /** `<a uiButton>` (empty attribute) means primary. */
  readonly variant = input<ButtonVariant | ''>('primary', { alias: 'uiButton' });
  readonly size = input<ButtonSize>('md');

  protected readonly classes = computed(
    () => `${BASE} ${VARIANTS[this.variant() || 'primary']} ${SIZES[this.size()]}`,
  );
}
