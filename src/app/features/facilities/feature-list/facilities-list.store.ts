import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PagedResult } from '@shared/models/paged-results.model';
import {
  LOADING_STATE,
  RequestState,
  errorState,
  successState,
} from '@shared/models/request-state.model';
import { FacilityRepository } from '../data-access/facility.repository';
import {
  DEFAULT_FACILITY_QUERY,
  FacilityQuery,
  isSameFacilityQuery,
} from '../models/facility-query.model';
import { Facility } from '../models/facility.model';
import { toFacilityErrorMessage } from '../utils/facility-error-message';

@Injectable()
export class FacilitiesListStore {
  private readonly repository = inject(FacilityRepository);

  readonly query = signal<FacilityQuery>(DEFAULT_FACILITY_QUERY, {
    equal: isSameFacilityQuery,
  });

  private readonly facilities = rxResource({
    params: () => this.query(),
    stream: ({ params }) => this.repository.list(params),
  });

  readonly state = computed<RequestState<PagedResult<Facility>>>(() => {
    switch (this.facilities.status()) {
      case 'error':
        return errorState(toFacilityErrorMessage(this.facilities.error()));
      case 'resolved':
      case 'local': {
        const page = this.facilities.value();
        return page ? successState(page) : LOADING_STATE;
      }
      default:
        return LOADING_STATE;
    }
  });

  readonly items = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data.items : [];
  });

  readonly total = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.data.total : 0;
  });

  readonly isEmpty = computed(() => this.state().status === 'success' && this.total() === 0);

  reload(): void {
    this.facilities.reload();
  }
}
