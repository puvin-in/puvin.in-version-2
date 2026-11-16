import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { IconNode } from 'lucide';

type SvgAttrs = Record<string, string | number | undefined>;

/**
 * Renders a Lucide icon node (`import { Layers } from 'lucide'`) as inline SVG.
 * Icons are decorative unless `label` is set.
 */
@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.stroke-width]="strokeWidth()"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.aria-label]="label() ?? null"
      [attr.role]="label() ? 'img' : null"
    >
      @for (node of nodes(); track $index) {
        @switch (node.tag) {
          @case ('path') {
            <svg:path [attr.d]="node.attrs['d']" />
          }
          @case ('circle') {
            <svg:circle [attr.cx]="node.attrs['cx']" [attr.cy]="node.attrs['cy']" [attr.r]="node.attrs['r']" />
          }
          @case ('rect') {
            <svg:rect
              [attr.x]="node.attrs['x']"
              [attr.y]="node.attrs['y']"
              [attr.width]="node.attrs['width']"
              [attr.height]="node.attrs['height']"
              [attr.rx]="node.attrs['rx']"
              [attr.ry]="node.attrs['ry']"
            />
          }
          @case ('line') {
            <svg:line
              [attr.x1]="node.attrs['x1']"
              [attr.y1]="node.attrs['y1']"
              [attr.x2]="node.attrs['x2']"
              [attr.y2]="node.attrs['y2']"
            />
          }
          @case ('polyline') {
            <svg:polyline [attr.points]="node.attrs['points']" />
          }
          @case ('polygon') {
            <svg:polygon [attr.points]="node.attrs['points']" />
          }
          @case ('ellipse') {
            <svg:ellipse
              [attr.cx]="node.attrs['cx']"
              [attr.cy]="node.attrs['cy']"
              [attr.rx]="node.attrs['rx']"
              [attr.ry]="node.attrs['ry']"
            />
          }
        }
      }
    </svg>
  `,
})
export class UiIcon {
  readonly icon = input.required<IconNode>();
  readonly size = input(20);
  readonly strokeWidth = input(2);
  readonly label = input<string>();

  protected readonly nodes = computed(() =>
    this.icon().map(([tag, attrs]) => ({ tag: String(tag), attrs: attrs as SvgAttrs })),
  );
}
