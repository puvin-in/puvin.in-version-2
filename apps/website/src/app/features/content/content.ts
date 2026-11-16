import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ContentBlock } from '@puvin/shared-validation';
import { UiButton } from '@puvin/ui';
import { SiteDataService } from '../../core/site-data.service';
import { SeoService } from '../../core/seo.service';

interface Entry {
  slug: string;
  title: string;
  summary: string;
  featuredImage?: string;
  blocks?: ContentBlock[];
  features?: string[];
  technologies?: string[];
  faqs?: { q: string; a: string }[];
  problem?: string;
  solution?: string;
  outcomes?: string;
  liveUrl?: string;
  repoUrl?: string;
}

@Component({
  imports: [RouterLink, UiButton],
  template: `
    <div class="pv-container py-16 sm:py-24">
      @if (slug()) { <a [routerLink]="['/', section()]" class="text-accent">← {{ label() }}</a> }
      @if (detail.hasValue()) {
        @let entry = detail.value().data;
        <article class="mx-auto max-w-3xl space-y-6">
          <h1 class="font-display text-4xl font-bold sm:text-6xl">{{ entry.title }}</h1>
          <p class="text-lg text-muted">{{ entry.summary }}</p>
          @if (entry.featuredImage) { <img [src]="entry.featuredImage" alt="" class="w-full rounded-2xl" /> }
          @for (block of entry.blocks ?? []; track $index) {
            @switch (block.type) {
              @case ('heading') {
                @if (block.level === 2) { <h2 class="text-2xl font-semibold">{{ block.text }}</h2> }
                @else { <h3 class="text-xl font-semibold">{{ block.text }}</h3> }
              }
              @case ('paragraph') { <p class="whitespace-pre-wrap leading-relaxed">{{ block.text }}</p> }
              @case ('list') {
                @if (block.ordered) {
                  <ol class="list-decimal pl-6">@for (item of block.items; track $index) { <li>{{ item }}</li> }</ol>
                } @else {
                  <ul class="list-disc pl-6">@for (item of block.items; track $index) { <li>{{ item }}</li> }</ul>
                }
              }
              @case ('quote') { <blockquote class="border-l-2 border-accent pl-4">{{ block.text }} @if (block.cite) { <cite>{{ block.cite }}</cite> }</blockquote> }
              @case ('code') { <pre class="overflow-x-auto rounded-xl bg-surface p-4"><code>{{ block.code }}</code></pre> }
              @case ('image') { <figure><img [src]="block.url" [alt]="block.alt" loading="lazy" /><figcaption>{{ block.caption }}</figcaption></figure> }
              @case ('video') { <video controls preload="none" [src]="block.url" [attr.aria-label]="block.caption || 'Video'"></video> }
              @case ('divider') { <hr class="border-border" /> }
            }
          }
          @for (part of [{label: 'Problem', text: entry.problem}, {label: 'Solution', text: entry.solution}, {label: 'Outcomes', text: entry.outcomes}]; track part.label) {
            @if (part.text) { <h2 class="text-2xl font-semibold">{{ part.label }}</h2><p class="whitespace-pre-wrap">{{ part.text }}</p> }
          }
          @if (entry.features?.length) {
            <h2 class="text-2xl font-semibold">Features</h2>
            <ul class="list-disc pl-6">@for (feature of entry.features; track $index) { <li>{{ feature }}</li> }</ul>
          }
          @if (entry.technologies; as technologies) {
            @if (technologies.length) { <p class="text-muted">{{ technologies.join(' · ') }}</p> }
          }
          @for (faq of entry.faqs ?? []; track $index) {
            <details class="pv-card p-4"><summary>{{ faq.q }}</summary><p class="mt-3">{{ faq.a }}</p></details>
          }
          <div class="flex gap-4">
            @if (entry.liveUrl) { <a uiButton [href]="entry.liveUrl">Live project</a> }
            @if (entry.repoUrl) { <a uiButton="secondary" [href]="entry.repoUrl">Repository</a> }
          </div>
        </article>
      } @else if (slug()) {
        @if (detail.error()) { <h1 class="mt-4 text-3xl font-bold">{{ detailError() }}</h1> }
        @else { <p role="status">Loading…</p> }
      } @else {
        <h1 class="font-display text-4xl font-bold sm:text-6xl">{{ label() }}</h1>
        @if (list.hasValue()) {
          <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            @for (entry of list.value().data; track entry.slug) {
              <a class="pv-card pv-card-interactive block overflow-hidden" [routerLink]="['/', section(), entry.slug]">
                @if (entry.featuredImage) { <img [src]="entry.featuredImage" alt="" class="aspect-video w-full object-cover" loading="lazy" /> }
                <div class="p-6"><h2 class="text-xl font-semibold">{{ entry.title }}</h2><p class="mt-2 text-muted">{{ entry.summary }}</p></div>
              </a>
            } @empty { <p class="text-muted">Nothing published here yet.</p> }
          </div>
          <div class="mt-6 flex gap-3">
            @if (page() > 1) { <button uiButton="secondary" (click)="page.update(n => n - 1)">Previous</button> }
            @if (list.value().hasMore) { <button uiButton="secondary" (click)="page.update(n => n + 1)">Next</button> }
          </div>
        } @else if (list.error()) {
          <p role="alert">Unable to load this section. <button uiButton="secondary" (click)="list.reload()">Retry</button></p>
        } @else { <p role="status">Loading…</p> }
      }
    </div>
  `,
})
export class ContentPage {
  readonly resource = input.required<string>();
  readonly section = input.required<string>();
  readonly slug = input<string>();
  protected readonly page = signal(1);
  protected readonly label = computed(() => ({ blog: 'Blog', portfolio: 'Projects', services: 'Services' })[this.section()]);
  protected readonly list = httpResource<{ data: Entry[]; hasMore: boolean }>(() =>
    this.slug() ? undefined : `/api/v1/public/${this.resource()}?page=${this.page()}`,
  );
  protected readonly detail = httpResource<{ data: Entry }>(() =>
    this.slug() ? `/api/v1/public/${this.resource()}/${encodeURIComponent(this.slug()!)}` : undefined,
  );
  protected readonly detailError = computed(() => {
    const error = this.detail.error();
    return error instanceof HttpErrorResponse && error.status === 404 ? 'Page not found' : 'Unable to load this page';
  });

  constructor() {
    const site = inject(SiteDataService);
    const seo = inject(SeoService);
    effect(() => {
      const defaults = site.site()?.seo;
      const entry = this.detail.hasValue() ? this.detail.value().data : undefined;
      if (defaults) seo.apply(defaults, { title: entry?.title ?? this.label(), description: entry?.summary,
        path: '/' + this.section() + (this.slug() ? '/' + this.slug() : '') });
    });
  }
}
