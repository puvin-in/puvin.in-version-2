import { Routes } from '@angular/router';
import { AdminShell } from './layout/admin-shell';
import { signedIn } from './features/cms/session';

export const sections = ['posts', 'projects', 'services', 'media', 'messages', 'settings', 'users'];

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign in · PUVIN Admin',
    loadComponent: () => import('./features/cms/login').then(m => m.LoginPage),
  },
  {
    path: '',
    component: AdminShell,
    canActivate: [signedIn],
    children: [
      {
        path: '',
        title: 'Dashboard · PUVIN Admin',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
      },
      ...sections.map(section => ({
        path: section,
        title: section[0]!.toUpperCase() + section.slice(1) + ' · PUVIN Admin',
        data: { section },
        loadComponent: () => import('./features/cms/manage').then(m => m.ManagePage),
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
