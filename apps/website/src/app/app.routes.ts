import { Routes } from '@angular/router';

const capturedPage = () => import('./features/captured-page/captured-page').then((m) => m.CapturedPage);

export const routes: Routes = [
  {
    path: '',
    loadComponent: capturedPage,
  },
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
