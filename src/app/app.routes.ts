import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'facilities' },
  {
    path: 'facilities',
    loadChildren: () =>
      import('@features/facilities/facilities.routes').then((routes) => routes.facilitiesRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./layout/not-found/not-found').then((page) => page.NotFound),
    title: 'Page not found',
  },
];
