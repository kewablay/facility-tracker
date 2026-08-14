import { Observable } from 'rxjs';

import { FacilityQuery } from '../models/facility-query.model';
import { Facility, FacilityUpdate } from '../models/facility.model';
import { PagedResult } from '@shared/models/paged-results.model';

export abstract class FacilityRepository {
  abstract list(query: FacilityQuery): Observable<PagedResult<Facility>>;
  abstract getById(id: string): Observable<Facility>;
  abstract update(id: string, changes: FacilityUpdate): Observable<Facility>;
}
