import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * CMS content changes without a rebuild, so pages render per request (cached by
 * nginx/CDN). Purely static routes can switch to Prerender as they are added.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
