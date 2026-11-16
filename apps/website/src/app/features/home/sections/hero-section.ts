import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ArrowRight, Download } from 'lucide';
import type { PublicSiteDto } from '@puvin/shared-types';
import { UiButton, UiIcon } from '@puvin/ui';

const ROLE_INTERVAL_MS = 2800;

@Component({
  selector: 'pv-hero-section',
  imports: [UiButton, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="hero-heading" class="relative overflow-hidden">
      <!-- Decorative gradient wash -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div
          class="absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]"
        ></div>
        <div
          class="absolute top-40 right-[-10%] h-[320px] w-[420px] rounded-full bg-accent-2/15 blur-[110px]"
        ></div>
      </div>

      <div
        class="pv-container grid items-center gap-12 pt-16 pb-20 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:pb-28"
      >
        <div>
          @if (profile().availability.available) {
            <p
              class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted"
            >
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none"
                ></span>
                <span class="relative inline-flex size-2 rounded-full bg-success"></span>
              </span>
              {{ profile().availability.label }}
            </p>
          }

          <h1
            id="hero-heading"
            class="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {{ headlineLead() }} <span class="pv-gradient-text">{{ headlineTail() }}</span>
          </h1>

          <p class="mt-6 text-lg text-text">
            Hi, I'm <strong class="font-semibold">{{ profile().displayName }}</strong> —
            <span class="text-accent-2" aria-live="polite">{{ currentRole() }}</span>
          </p>

          @for (paragraph of profile().heroIntro; track $index) {
            <p class="mt-3 max-w-xl text-base leading-relaxed text-muted">{{ paragraph }}</p>
          }

          <div class="mt-8 flex flex-wrap gap-3">
            <a uiButton size="lg" [href]="home().primaryCta.href">
              {{ home().primaryCta.label }}
              <ui-icon [icon]="arrowIcon" [size]="18" />
            </a>
            <a uiButton="secondary" size="lg" [href]="home().secondaryCta.href">{{
              home().secondaryCta.label
            }}</a>
            @if (profile().resumeUrl; as resume) {
              <a uiButton="ghost" size="lg" [href]="resume" download>
                <ui-icon [icon]="downloadIcon" [size]="18" /> Resume
              </a>
            }
          </div>

          @if (profile().social.length) {
            <ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social profiles">
              @for (social of profile().social; track social.url) {
                <li>
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer me"
                    class="text-sm text-muted underline-offset-4 hover:text-text hover:underline"
                    >{{ social.label || social.platform }}</a
                  >
                </li>
              }
            </ul>
          }
        </div>

        <!-- Code-styled profile card built from live CMS data -->
        <figure
          class="pv-card overflow-hidden font-mono text-[13px] leading-6 shadow-[0_30px_80px_-30px_var(--pv-glow)] sm:text-sm"
          aria-label="Developer profile summary"
        >
          <div class="flex items-center gap-2 border-b border-border px-4 py-3">
            <span class="size-3 rounded-full bg-error/80"></span>
            <span class="size-3 rounded-full bg-warning/80"></span>
            <span class="size-3 rounded-full bg-success/80"></span>
            <span class="ml-3 text-xs text-muted">developer.ts</span>
          </div>
          <pre class="overflow-x-auto p-5 text-muted"><code><span class="text-accent">const</span> <span class="text-text">developer</span> = {{ '{' }}
  name: <span class="text-success">'{{ profile().displayName }}'</span>,
  role: <span class="text-success">'{{ profile().headline }}'</span>,
  stack: [@for (skill of stackPreview(); track skill; let last = $last) {<span class="text-success">'{{ skill }}'</span>@if (!last) {, }}],
  available: <span class="text-accent-2">{{ profile().availability.available }}</span>,
{{ '}' }};</code></pre>
        </figure>
      </div>
    </section>
  `,
})
export class HeroSection {
  readonly site = input.required<PublicSiteDto>();

  protected readonly profile = computed(() => this.site().profile);
  protected readonly home = computed(() => this.site().home);
  protected readonly arrowIcon = ArrowRight;
  protected readonly downloadIcon = Download;

  /** Gradient applies to the last three words of the CMS headline. */
  private readonly headlineWords = computed(() => this.home().heroHeadline.trim().split(/\s+/));
  protected readonly headlineLead = computed(() => this.headlineWords().slice(0, -3).join(' '));
  protected readonly headlineTail = computed(() => this.headlineWords().slice(-3).join(' '));

  protected readonly stackPreview = computed(() => this.site().skills.slice(0, 4).map((s) => s.name));

  private readonly roleIndex = signal(0);
  protected readonly currentRole = computed(() => {
    const roles = this.profile().roles;
    return roles.length ? roles[this.roleIndex() % roles.length] : this.profile().headline;
  });

  constructor() {
    // Rotate roles in the browser only, and not at all for reduced-motion users.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      if (this.profile().roles.length > 1) this.roleIndex.update((i) => i + 1);
    }, ROLE_INTERVAL_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
