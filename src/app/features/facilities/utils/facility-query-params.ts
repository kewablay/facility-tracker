import { toPositiveInteger } from '@shared/utils/to-positive-integer';
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, FacilityQuery } from '../models/facility-query.model';
import { isFacilityStatus } from '../models/facility-status.model';

export interface FacilityQueryParams {
  q: string;
  status: string;
  page: string;
  pageSize: string;
}

export function toFacilityQuery(params: FacilityQueryParams): FacilityQuery {
  return {
    searchTerm: params.q.trim(),
    status: isFacilityStatus(params.status) ? params.status : null,
    page: toPositiveInteger(params.page, FIRST_PAGE),
    pageSize: toPositiveInteger(params.pageSize, DEFAULT_PAGE_SIZE),
  };
}
