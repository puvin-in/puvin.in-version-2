import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withXsrfConfiguration } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      // Double-submit CSRF token for cookie-authenticated mutations (API side lands in Phase 2).
      withXsrfConfiguration({ cookieName: 'puvin_xsrf', headerName: 'X-XSRF-TOKEN' }),
    ),
  ],
};
