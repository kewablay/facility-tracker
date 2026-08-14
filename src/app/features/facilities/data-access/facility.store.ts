import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  LOADING_STATE,
  RequestState,
  errorState,
  successState,
} from '@shared/models/request-state.model';
import { Facility } from '../models/facility.model';
import { toFacilityErrorMessage } from '../utils/facility-error-message';
import { FacilityNotFoundError } from './facility.errors';
import { FacilityRepository } from './facility.repository';

@Injectable()
export class FacilityStore {
  private readonly repository = inject(FacilityRepository);

  readonly facilityId = signal<string | undefined>(undefined);

  private readonly facility = rxResource({
    params: () => this.facilityId(),
    stream: ({ params }) => this.repository.getById(params),
  });

  readonly state = computed<RequestState<Facility>>(() => {
    switch (this.facility.status()) {
      case 'error':
        return errorState(toFacilityErrorMessage(this.facility.error()));
      case 'resolved':
      case 'local': {
        const facility = this.facility.value();
        return facility ? successState(facility) : LOADING_STATE;
      }
      default:
        return LOADING_STATE;
    }
  });

  readonly notFound = computed(() => this.facility.error() instanceof FacilityNotFoundError);

  reload(): void {
    this.facility.reload();
  }
}
