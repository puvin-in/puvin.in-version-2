import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Activity, Database, RotateCw } from 'lucide';
import { API_ROUTES } from '@puvin/shared-config';
import type { ApiSuccess, HealthDto, PublicSiteDto } from '@puvin/shared-types';
import { UiButton, UiIcon, UiSkeleton, UiStateMessage } from '@puvin/ui';

interface Stat {
  label: string;
  value: string;
  hint?: string;
}

/**
 * Phase 1 dashboard: live API/database health and a read-only summary of the
 * content currently served to the public site. All values come from the API.
 */
@Component({
  selector: 'pva-dashboard-page',
  imports: [UiButton, UiIcon, UiSkeleton, UiStateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="pv-eyebrow">Overview</p>
          <h1 class="mt-2 font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <button uiButton="secondary" size="sm" type="button" (click)="refresh()" [disabled]="busy()">
          <ui-icon [icon]="refreshIcon" [size]="16" [class.animate-spin]="busy()" />
          Refresh
        </button>
      </div>

      <!-- System health -->
      <section aria-labelledby="health-heading" class="mt-8">
        <h2 id="health-heading" class="flex items-center gap-2 font-display text-lg font-semibold">
          <ui-icon [icon]="activityIcon" [size]="18" class="text-accent-2" /> System health
        </h2>

        @if (health.hasValue()) {
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="pv-card p-5">
              <p class="text-sm text-muted">API</p>
              <p class="mt-2 flex items-center gap-2 text-xl font-semibold">
                <span
                  class="size-2.5 rounded-full"
                  [class.bg-success]="healthData()?.status === 'ok'"
                  [class.bg-warning]="healthData()?.status !== 'ok'"
                ></span>
                {{ healthData()?.status === 'ok' ? 'Operational' : 'Degraded' }}
              </p>
            </div>
            <div class="pv-card p-5">
              <p class="flex items-center gap-1.5 text-sm text-muted">
                <ui-icon [icon]="dbIcon" [size]="14" /> Database
              </p>
              <p class="mt-2 text-xl font-semibold">
                {{ healthData()?.checks?.database?.state === 'up' ? 'Connected' : 'Unreachable' }}
              </p>
              @if (healthData()?.checks?.database?.latencyMs !== undefined) {
                <p class="mt-1 text-xs text-muted">{{ healthData()?.checks?.database?.latencyMs }} ms ping</p>
              }
            </div>
            <div class="pv-card p-5">
              <p class="text-sm text-muted">API version</p>
              <p class="mt-2 font-mono text-xl font-semibold">{{ healthData()?.version }}</p>
            </div>
            <div class="pv-card p-5">
              <p class="text-sm text-muted">Uptime</p>
              <p class="mt-2 text-xl font-semibold">{{ uptime() }}</p>
            </div>
          </div>
        } @else if (health.error()) {
          <div class="mt-4">
            <ui-state-message
              tone="error"
              heading="API or database unavailable"
              message="Check that the API service is running and that /api is routed to it."
              actionLabel="Retry"
              (action)="health.reload()"
            />
          </div>
        } @else {
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <ui-skeleton height="6rem" />
            }
          </div>
        }
      </section>

      <!-- Published content -->
      <section aria-labelledby="content-heading" class="mt-10">
        <h2 id="content-heading" class="font-display text-lg font-semibold">Public site content</h2>

        @if (contentStats(); as stats) {
          <dl class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (stat of stats; track stat.label) {
              <div class="pv-card p-5">
                <dt class="text-sm text-muted">{{ stat.label }}</dt>
                <dd class="mt-2 text-xl font-semibold">{{ stat.value }}</dd>
                @if (stat.hint) {
                  <dd class="mt-1 text-xs text-muted">{{ stat.hint }}</dd>
                }
              </div>
            }
          </dl>
        } @else if (site.error()) {
          <div class="mt-4">
            <ui-state-message
              tone="error"
              heading="Site content is unavailable"
              message="If this is a new installation, run npm run seed to load the initial content."
              actionLabel="Retry"
              (action)="site.reload()"
            />
          </div>
        } @else {
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <ui-skeleton height="6rem" />
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class DashboardPage {
  protected readonly health = httpResource<ApiSuccess<HealthDto>>(() => API_ROUTES.healthReady);
  protected readonly site = httpResource<ApiSuccess<PublicSiteDto>>(() => API_ROUTES.publicSite);

  protected readonly refreshIcon = RotateCw;
  protected readonly activityIcon = Activity;
  protected readonly dbIcon = Database;

  protected readonly busy = computed(() => this.health.isLoading() || this.site.isLoading());
  protected readonly healthData = computed(() =>
    this.health.hasValue() ? this.health.value().data : null,
  );

  protected readonly uptime = computed(() => {
    const seconds = this.healthData()?.uptimeSeconds ?? 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m ${seconds % 60}s`;
  });

  protected readonly contentStats = computed<Stat[] | null>(() => {
    if (!this.site.hasValue()) return null;
    const s = this.site.value().data;
    return [
      { label: 'Site owner', value: s.profile.displayName, hint: s.profile.headline },
      { label: 'Visible skills', value: String(s.skills.length) },
      { label: 'Published services', value: String(s.services.length) },
      {
        label: 'Search indexing',
        value: s.seo.indexable ? 'Enabled' : 'Disabled',
        hint: s.seo.indexable ? undefined : 'Enable at launch (Settings → SEO)',
      },
    ];
  });

  refresh(): void {
    this.health.reload();
    this.site.reload();
  }
}
