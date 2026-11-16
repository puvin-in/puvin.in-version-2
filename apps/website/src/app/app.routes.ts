import { Routes } from '@angular/router';

const capturedPage = () => import('./features/captured-page/captured-page').then((m) => m.CapturedPage);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomePage),
  },
  ...Object.entries({ blog: 'posts', portfolio: 'projects', services: 'services' }).flatMap(
    ([path, resource]) => ['', '/:slug'].map(suffix => ({
      path: path + suffix, data: { resource, section: path },
      loadComponent: () => import('./features/content/content').then(m => m.ContentPage),
    })),
  ),
  { path: 'about', redirectTo: '' },
  { path: 'contact', loadComponent: () => import('./features/content/contact').then(m => m.ContactPage) },
  {
    path: 'main-demo',
    loadComponent: capturedPage,
  },
  {
    path: 'corporate-agency',
    loadComponent: capturedPage,
  },
  {
    path: 'personal-portfolio-02',
    loadComponent: capturedPage,
  },
  {
    path: 'minimal-portfolio',
    loadComponent: capturedPage,
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
