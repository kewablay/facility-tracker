import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { FacilityRepository } from '@features/facilities/data-access/facility.repository';
import { InMemoryFacilityRepository } from '@features/facilities/data-access/in-memory-facility.repository';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: FacilityRepository, useClass: InMemoryFacilityRepository },
  ],
};
