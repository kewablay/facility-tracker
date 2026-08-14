import { Routes } from '@angular/router';
import { mockAuthGuard } from '@core/guards/mock-auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'facilities' },
  {
    path: 'facilities',
    canActivate: [mockAuthGuard],
    loadChildren: () =>
      import('@features/facilities/facilities.routes').then((routes) => routes.facilitiesRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./layout/not-found/not-found').then((page) => page.NotFound),
    title: 'Page not found',
  },
];
