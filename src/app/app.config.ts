import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { errorInterceptor } from '@core/http/error.interceptor';
import { PetrolPreset } from '@core/theme/petrol.preset';
import { FacilityRepository } from '@features/facilities/data-access/facility.repository';
import { InMemoryFacilityRepository } from '@features/facilities/data-access/in-memory-facility.repository';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    providePrimeNG({
      license: environment.primeNgLicenseKey,
      theme: {
        preset: PetrolPreset,
        options: { darkModeSelector: false },
      },
    }),
    MessageService,
    { provide: FacilityRepository, useClass: InMemoryFacilityRepository },
  ],
};
