import { Routes } from '@angular/router';

export const FACILITIES_LIST_PATH = '/facilities';

export const facilitiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature-list/facility-list').then((page) => page.FacilityList),
    title: 'Facilities',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./feature-detail/facility-detail').then((page) => page.FacilityDetail),
    title: 'Facility',
  },
];
