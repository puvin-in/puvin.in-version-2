import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_LABELS,
  type SkillCategory,
  type SkillDto,
} from '@puvin/shared-types';
import { SectionHeading } from './section-heading';

@Component({
  selector: 'pv-skills-section',
  imports: [SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" aria-labelledby="skills-heading" class="pv-container py-20">
      <pv-section-heading
        eyebrow="Skills & technologies"
        heading="The tools I build with."
        headingId="skills-heading"
      />
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (group of groups(); track group.category) {
          <div class="pv-card pv-card-interactive p-6">
            <h3 class="font-display text-base font-semibold">{{ group.label }}</h3>
            <ul class="mt-4 flex flex-wrap gap-2">
              @for (skill of group.skills; track skill.id) {
                <li
                  class="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-xs text-text"
                >
                  {{ skill.name }}
                  @if (skill.proficiency) {
                    <span class="text-muted"> · {{ skill.proficiency }}</span>
                  }
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsSection {
  readonly skills = input.required<SkillDto[]>();

  /** Groups in the canonical category order; empty categories are skipped. */
  protected readonly groups = computed(() =>
    SKILL_CATEGORIES.map((category: SkillCategory) => ({
      category,
      label: SKILL_CATEGORY_LABELS[category],
      skills: this.skills().filter((s) => s.category === category),
    })).filter((g) => g.skills.length > 0),
  );
}
