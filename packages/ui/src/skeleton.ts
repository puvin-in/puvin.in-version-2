import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class: 'block animate-pulse rounded-[10px] bg-surface-2 motion-reduce:animate-none',
    '[style.height]': 'height()',
    '[style.width]': 'width()',
  },
  template: '',
})
export class UiSkeleton {
  readonly height = input('1rem');
  readonly width = input('100%');
}
