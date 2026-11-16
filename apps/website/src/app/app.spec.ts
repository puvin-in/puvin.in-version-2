import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import type { ApiSuccess, PublicSiteDto } from '@puvin/shared-types';
import { App } from './app';
import { routes } from './app.routes';

const SITE: PublicSiteDto = {
  branding: { brandName: 'PUVIN', tagline: 'Full Stack Developer', colors: { accent: '#7C3AED', accent2: '#22D3EE' } },
  profile: {
    displayName: 'Test Owner',
    headline: 'Full Stack Developer',
    roles: ['Full Stack Developer'],
    heroIntro: ['Intro text.'],
    aboutSummary: ['About text.'],
    highlights: ['Clean code'],
    availability: { available: true, label: 'Available for freelance' },
    social: [],
  },
  home: {
    heroHeadline: 'Building Powerful Digital Experiences with Modern Web Technologies.',
    primaryCta: { label: 'Hire Me', href: '#contact' },
    secondaryCta: { label: 'View Services', href: '#services' },
    process: [{ title: 'Discovery' }, { title: 'Planning' }],
    contactCta: { heading: "Have An Idea? Let's Make It Real", text: 'Collaborate.' },
  },
  seo: {
    siteTitle: 'PUVIN',
    titleTemplate: '%s | PUVIN',
    description: 'desc',
    canonicalOrigin: 'https://puvin.in',
    indexable: false,
  },
  skills: [{ id: '1', name: 'MongoDB', category: 'database', displayOrder: 0 }],
  services: [{ id: 's1', title: 'Backend API Development', slug: 'backend-api-development', summary: 'APIs.', displayOrder: 0 }],
  contentVersion: 1,
};

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    http.verify();
  });

  async function render() {
    const fixture = TestBed.createComponent(App);
    fixture.autoDetectChanges();
    TestBed.tick();
    return fixture;
  }

  it('renders the brand from the site API', async () => {
    const fixture = await render();
    http.expectOne('/api/v1/public/site').flush({ data: SITE } satisfies ApiSuccess<PublicSiteDto>);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header')?.textContent).toContain('PUVIN');
    expect(el.querySelector('footer')?.textContent).toContain('Test Owner');
  });

  it('renders homepage sections from CMS data', async () => {
    const fixture = await render();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    http.expectOne('/api/v1/public/site').flush({ data: SITE });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Building Powerful Digital Experiences');
    expect(el.querySelector('#skills')?.textContent).toContain('MongoDB');
    expect(el.querySelector('#services')?.textContent).toContain('Backend API Development');
    // No email configured: no mailto link is invented.
    expect(el.querySelector('#contact a[href^="mailto:"]')).toBeNull();
  });

  it('shows an error state with retry when the API fails', async () => {
    const fixture = await render();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    http.expectOne('/api/v1/public/site').flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('could not be loaded');
  });
});
