import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Observable, delay, of, switchMap, throwError, timer } from 'rxjs';

import { FacilityQuery } from '../models/facility-query.model';
import { Facility, FacilityUpdate } from '../models/facility.model';

import { FACILITIES_SEED } from './facilities.seed';
import { FacilityNotFoundError, FacilityRequestFailedError } from './facility.errors';
import { toFacility } from './facility.mapper';
import { FacilityRepository } from './facility.repository';
import { PagedResult } from '@shared/models/paged-results.model';
import { filterFacilities } from '../utils/facility-filter';
import { paginate } from '@shared/utils/paginate';

const SIMULATED_LOADING_DELAY = 400;

// Add `?simulateFailure=true` to any URL to make the next list() fail.
export const SIMULATE_FAILURE_PARAM = 'simulateFailure';
const SIMULATE_FAILURE_VALUE = 'true';

@Injectable()
export class InMemoryFacilityRepository extends FacilityRepository {
  private readonly document = inject(DOCUMENT);
  private readonly facilities: Facility[] = FACILITIES_SEED.map(toFacility);
  private simulatedFailureSpent = false;

  /** Filtering and pagination happen here, so callers never receive the full collection. */
  list(query: FacilityQuery): Observable<PagedResult<Facility>> {
    if (this.consumeSimulatedFailure()) {
      return this.failAfterLatency(new FacilityRequestFailedError());
    }
    const matches = filterFacilities(this.facilities, query);
    const items = paginate(matches, query.page, query.pageSize);
    return this.respondAfterLatency({ items, total: matches.length });
  }

  getById(id: string): Observable<Facility> {
    const facility = this.facilities.find((candidate) => candidate.id === id);
    return facility
      ? this.respondAfterLatency(facility)
      : this.failAfterLatency(new FacilityNotFoundError(id));
  }

  update(id: string, changes: FacilityUpdate): Observable<Facility> {
    const index = this.facilities.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      return this.failAfterLatency(new FacilityNotFoundError(id));
    }
    const updated: Facility = { ...this.facilities[index], ...changes, lastUpdatedAt: new Date() };
    this.facilities[index] = updated;
    return this.respondAfterLatency(updated);
  }

  /** Reads the switch and spends it, so the retry after a simulated failure succeeds. */
  private consumeSimulatedFailure(): boolean {
    if (this.simulatedFailureSpent) {
      return false;
    }
    const search = this.document.defaultView?.location.search ?? '';
    const requested =
      new URLSearchParams(search).get(SIMULATE_FAILURE_PARAM) === SIMULATE_FAILURE_VALUE;
    this.simulatedFailureSpent = requested;
    return requested;
  }

  private respondAfterLatency<TValue>(value: TValue): Observable<TValue> {
    return of(value).pipe(delay(SIMULATED_LOADING_DELAY));
  }

  /** `delay` passes errors through immediately, so a failure has to be timed with `timer`. */
  private failAfterLatency<TValue>(error: Error): Observable<TValue> {
    return timer(SIMULATED_LOADING_DELAY).pipe(switchMap(() => throwError(() => error)));
  }
}
