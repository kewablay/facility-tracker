import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { FacilityRepository } from '@features/facilities/data-access/facility.repository';
import { InMemoryFacilityRepository } from '@features/facilities/data-access/in-memory-facility.repository';

import { withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { PetrolPreset } from '@core/theme/petrol.preset';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      license: environment.primeNgLicenseKey,
      theme: {
        preset: PetrolPreset,
        options: { darkModeSelector: false },
      },
    }),
    { provide: FacilityRepository, useClass: InMemoryFacilityRepository },
  ],
};
