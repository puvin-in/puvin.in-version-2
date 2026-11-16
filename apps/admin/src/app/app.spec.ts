import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard';

describe('DashboardPage', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows live health and content numbers from the API', async () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.autoDetectChanges();
    TestBed.tick();

    http.expectOne('/api/v1/health/ready').flush({
      data: {
        status: 'ok',
        version: '0.1.0',
        uptimeSeconds: 3725,
        timestamp: new Date().toISOString(),
        checks: { database: { state: 'up', latencyMs: 3 } },
      },
    });
    http.expectOne('/api/v1/public/site').flush({
      data: {
        profile: { displayName: 'Owner', headline: 'Dev' },
        skills: [{}, {}, {}],
        services: [{}],
        seo: { indexable: false },
      },
    });
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Operational');
    expect(text).toContain('Connected');
    expect(text).toContain('1h 2m');
    expect(text).toContain('Owner');
    expect(text).toContain('Disabled');
  });

  it('shows an actionable error when the API is down', async () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.autoDetectChanges();
    TestBed.tick();

    http.expectOne('/api/v1/health/ready').error(new ProgressEvent('error'));
    http.expectOne('/api/v1/public/site').error(new ProgressEvent('error'));
    await fixture.whenStable();

    const alerts = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(2);
    expect(alerts[0]?.textContent).toContain('unavailable');
  });
});
