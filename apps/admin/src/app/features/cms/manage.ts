import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButton } from '@puvin/ui';

type Item = Record<string, unknown> & {
  _id?: string; id?: string; title?: string; name?: string; email?: string;
  status?: string; slug?: string; owner?: boolean; active?: boolean; url?: string;
  alt?: string; subject?: string; message?: string; read?: boolean;
};
const contentModules = ['posts', 'projects', 'services'];

@Component({
  imports: [FormsModule, UiButton],
  template: `
    <div class="mx-auto max-w-6xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="font-display text-3xl font-bold capitalize">{{ section() }}</h1>
        @if (isContent() || section() === 'users') {
          <button uiButton (click)="edit({})" [disabled]="busy()">New {{ section().slice(0, -1) }}</button>
        }
      </div>
      @if (error()) { <p class="mt-4 rounded-lg border border-border p-3" role="alert">{{ error() }}</p> }
      @if (notice()) { <p class="mt-4 text-success" role="status">{{ notice() }}</p> }
      @if (section() === 'settings') {
        @if (settings.hasValue()) {
          @if (!editing()) {
            <div class="mt-5 flex flex-wrap gap-3">
              <button uiButton (click)="edit(settings.value().data)">Edit site settings</button>
              <button uiButton="secondary" (click)="edit({profile: settings.value().data['profile'], id: 'profile'})">Edit owner profile</button>
            </div>
          }
        } @else if (settings.error()) { <p class="mt-4" role="alert">{{ describe(settings.error()) }}</p> }
        @else { <p role="status">Loading settings…</p> }
      }
      @if (section() === 'media') {
        <form class="pv-card mt-5 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          (submit)="upload($event, image, alt)">
          <label>Public image (PNG, JPEG, WebP, up to 5 MiB)<input #image type="file" accept="image/png,image/jpeg,image/webp" required /></label>
          <label>Alt text<input #alt maxlength="300" /></label>
          <button uiButton [disabled]="busy()">Upload</button>
        </form>
      }
      @if (editing(); as item) {
        <form class="pv-card mt-6 grid gap-4 p-5" #form="ngForm" (ngSubmit)="save(item, form.value)">
          <h2 class="font-display text-xl font-semibold">{{ item.id || item._id || section() === 'settings' ? 'Edit' : 'Create' }}</h2>
          @if (isContent()) {
            <div class="grid gap-4 sm:grid-cols-2">
              <label>Title <input [ngModel]="item.title ?? ''" name="title" required maxlength="160" /></label>
              <label>Slug <input [ngModel]="item.slug ?? ''" name="slug" placeholder="Generated from title if empty" maxlength="120" /></label>
              <label>Status <select [ngModel]="item.status ?? 'draft'" name="status"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label>Featured image URL <input [ngModel]="item['featuredImage'] ?? ''" name="featuredImage" /></label>
              @if (section() !== 'posts') { <label>Display order <input type="number" name="displayOrder" [ngModel]="item['displayOrder'] ?? 0" min="0" required /></label> }
            </div>
            <label>Summary <textarea name="summary" [ngModel]="item['summary'] ?? ''" maxlength="600" rows="2"></textarea></label>
            @if (section() === 'services') { <label>Icon name <input [ngModel]="item['icon'] ?? ''" name="icon" maxlength="60" /></label> }
            <label>Body <textarea name="body" [ngModel]="body()" rows="7" placeholder="Separate paragraphs with a blank line"></textarea></label>
            <details>
              <summary>Structured blocks and metadata</summary>
              <label>Content JSON <textarea class="font-mono" name="json" [ngModel]="json()" rows="12"></textarea></label>
            </details>
          } @else if (section() === 'users') {
            <label>Name <input [ngModel]="item.name ?? ''" name="name" required maxlength="120" /></label>
            <label>Email <input [ngModel]="item.email ?? ''" name="email" required email type="email" /></label>
            <label>{{ item._id ? 'New password (optional)' : 'Password' }} <input ngModel name="password" type="password" [required]="!item._id" minlength="12" maxlength="200" autocomplete="new-password" /></label>
            @if (item._id) { <label class="flex items-center gap-2"><input type="checkbox" name="active" [ngModel]="item.active" /> Active account</label> }
          } @else if (section() === 'settings') {
            @if (item.id === 'profile') {
              <label>Owner profile <textarea name="profile" [ngModel]="pretty(item['profile'])" rows="18" spellcheck="false"></textarea></label>
            } @else {
              <div class="grid gap-4 sm:grid-cols-2">
              <label>Branding <textarea name="branding" [ngModel]="pretty(item['branding'])" rows="9" spellcheck="false"></textarea></label>
              <label>SEO defaults <textarea name="seo" [ngModel]="pretty(item['seo'])" rows="9" spellcheck="false"></textarea></label>
              <label>Homepage <textarea name="home" [ngModel]="pretty(item['home'])" rows="15" spellcheck="false"></textarea></label>
              </div>
            }
          } @else if (section() === 'media') {
            <label>Alt text <input name="alt" [ngModel]="item.alt ?? ''" maxlength="300" /></label>
          }
          <div class="flex gap-3"><button uiButton [disabled]="form.invalid || busy()">Save</button>
            <button uiButton="secondary" type="button" (click)="editing.set(null)" [disabled]="busy()">Cancel</button></div>
        </form>
      }
      @if (section() !== 'settings') {
        @if (list.hasValue()) {
          <div class="mt-6 grid gap-3">
            @for (item of list.value().data; track item.id ?? item._id) {
              <article class="pv-card flex flex-wrap items-start justify-between gap-4 p-5">
                <div class="min-w-0 flex-1 break-words">
                  @if (item.url) { <img [src]="item.url" [alt]="item.alt ?? ''" class="mb-3 size-24 rounded-lg object-cover" loading="lazy" /> }
                  <h2 class="font-semibold">{{ item.title || item.subject || item.name }}</h2>
                  @if (item.email) { <p class="text-sm text-muted">{{ item.email }}</p> }
                  @if (item.status) { <p class="mt-1 text-sm capitalize text-muted">{{ item.status }} · {{ item.slug }}</p> }
                  @if (section() === 'users') { <p class="text-sm text-muted">{{ item.owner ? 'Owner' : item.active ? 'Active staff' : 'Disabled staff' }}</p> }
                  @if (item.url) { <label>Image URL <input readonly [value]="item.url" (focus)="$any($event.target).select()" /></label> }
                  @if (section() === 'messages') {
                    <p class="mt-2 whitespace-pre-wrap">{{ item.message }}</p>
                    <p class="mt-2 text-sm text-muted">{{ item.read ? 'Read' : 'Unread' }}</p>
                  }
                </div>
                @if (section() === 'messages') {
                  <button uiButton="secondary" (click)="mutate('PATCH', item._id, { read: !item.read })" [disabled]="busy()">{{ item.read ? 'Mark unread' : 'Mark read' }}</button>
                } @else if (!item.owner) {
                  <button uiButton="secondary" (click)="edit(item)" [disabled]="busy()">Edit</button>
                }
              </article>
            } @empty { <p class="text-muted">No {{ section() }} yet.</p> }
          </div>
          <div class="mt-4 flex gap-3">
            @if (page() > 1) { <button uiButton="secondary" (click)="page.update(n => n - 1)">Previous</button> }
            @if (list.value().hasMore) { <button uiButton="secondary" (click)="page.update(n => n + 1)">Next</button> }
          </div>
        } @else if (list.error()) {
          <p class="mt-4" role="alert">{{ describe(list.error()) }}</p>
          <button uiButton="secondary" class="mt-2" (click)="retry()">Retry</button>
        } @else { <p class="mt-4" role="status">Loading…</p> }
      }
    </div>
  `,
})
export class ManagePage {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly section = input.required<string>();
  protected readonly base = computed(() => '/api/v1/admin/' + this.section());
  protected readonly isContent = computed(() => contentModules.includes(this.section()));
  protected readonly page = signal(1);
  protected readonly list = httpResource<{ data: Item[]; hasMore: boolean }>(() =>
    this.section() === 'settings' ? undefined : this.base() + '?page=' + this.page(),
  );
  protected readonly settings = httpResource<{ data: Item }>(() =>
    this.section() === 'settings' ? this.base() : undefined,
  );
  protected readonly editing = signal<Item | null>(null);
  protected readonly body = signal('');
  protected readonly json = signal('');
  protected readonly error = signal('');
  protected readonly notice = signal('');
  protected readonly busy = signal(false);

  protected pretty(value: unknown) { return JSON.stringify(value, null, 2); }

  protected describe(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'The request failed. Try again.';
    const details = error.error?.error?.details as { path: string; message: string }[] | undefined;
    return details?.map(entry => entry.path + ' — ' + entry.message).join(' · ') ||
      error.error?.error?.message || 'The request failed. Try again.';
  }

  protected retry() {
    if (this.list.error() instanceof HttpErrorResponse && (this.list.error() as HttpErrorResponse).status === 401) {
      void this.router.navigateByUrl('/login');
    } else this.list.reload();
  }

  protected edit(item: Item) {
    this.error.set('');
    this.notice.set('');
    this.editing.set(item);
    if (!this.isContent()) return;
    const { id, title, slug, status, summary, featuredImage, icon, displayOrder, publishedAt, ...extra } = item;
    const blocks = Array.isArray(extra['blocks']) ? extra['blocks'] : [];
    this.body.set(blocks.filter(block => block.type === 'paragraph').map(block => block.text).join('\n\n'));
    this.json.set(this.pretty({ ...extra, blocks }));
  }

  protected save(item: Item, value: Record<string, string>) {
    try {
      const key = item.id ?? item._id;
      if (this.section() === 'settings') {
        const settings = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, JSON.parse(v)]));
        this.mutate('PUT', key, key === 'profile' ? settings['profile'] : settings);
      } else if (this.section() === 'users') {
        const { password, ...rest } = value;
        this.mutate(key ? 'PATCH' : 'POST', key, { ...rest, ...(password ? { password } : {}) });
      } else if (this.isContent()) {
        const { json, body, ...fields } = value;
        const extra = JSON.parse(json!);
        if (extra === null || typeof extra !== 'object' || Array.isArray(extra)) throw new Error();
        if (body !== this.body()) {
          if (Array.isArray(extra.blocks) && extra.blocks.some((block: { type: string }) => block.type !== 'paragraph')) {
            this.error.set('Edit the blocks in Content JSON to preserve headings, images, and other structured blocks.');
            return;
          }
          extra.blocks = (body ?? '').split(/\n\s*\n/).map(text => text.trim()).filter(Boolean)
            .map(text => ({ type: 'paragraph', text }));
        }
        this.mutate(key ? 'PUT' : 'POST', key, { ...extra, ...fields });
      } else {
        this.mutate('PATCH', key, value);
      }
    } catch {
      this.error.set('Enter valid JSON before saving.');
    }
  }

  protected upload(event: Event, image: HTMLInputElement, alt: HTMLInputElement) {
    event.preventDefault();
    const file = image.files?.[0];
    if (!file || this.busy()) return;
    const data = new FormData();
    data.set('image', file);
    data.set('alt', alt.value);
    this.mutate('POST', undefined, data, () => { image.value = ''; alt.value = ''; });
  }

  protected mutate(method: string, id: string | undefined, body: unknown, finished?: () => void) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    this.http.request(method, this.base() + (id ? '/' + encodeURIComponent(id) : ''), { body }).subscribe({
      next: () => {
        this.editing.set(null);
        this.busy.set(false);
        this.notice.set('Saved');
        finished?.();
        if (method === 'POST' && this.page() !== 1) this.page.set(1);
        else if (this.section() === 'settings') this.settings.reload();
        else this.list.reload();
      },
      error: response => {
        this.busy.set(false);
        if (response.status === 401) void this.router.navigateByUrl('/login');
        else this.error.set(this.describe(response));
      },
    });
  }
}
