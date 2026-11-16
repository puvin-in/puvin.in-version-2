import { Routes } from '@angular/router';
import { AdminShell } from './layout/admin-shell';

export const routes: Routes = [
  {
    path: '',
    component: AdminShell,
    children: [
      {
        path: '',
        title: 'Dashboard · PUVIN Admin',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
