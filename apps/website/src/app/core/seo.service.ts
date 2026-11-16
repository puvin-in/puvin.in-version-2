import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { SeoDefaultsDto } from '@puvin/shared-types';

export interface PageSeo {
  /** Page-specific title; omitted for the homepage, which uses the site title alone. */
  title?: string;
  description?: string;
  path: string;
  noindex?: boolean;
}

/** Writes title, description, canonical, robots and Open Graph tags into the SSR HTML. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(defaults: SeoDefaultsDto, page: PageSeo): void {
    const fullTitle = page.title
      ? defaults.titleTemplate.replace('%s', page.title)
      : defaults.siteTitle;
    const description = page.description || defaults.description;
    const canonical = new URL(page.path, defaults.canonicalOrigin).toString();
    const indexable = defaults.indexable && !page.noindex;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: indexable ? 'index, follow' : 'noindex, nofollow' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:site_name', content: defaults.siteTitle });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    if (defaults.defaultSocialImageUrl) {
      this.meta.updateTag({ property: 'og:image', content: defaults.defaultSocialImageUrl });
    }
    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
