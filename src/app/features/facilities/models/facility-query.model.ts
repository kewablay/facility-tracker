import { FacilityStatus } from './facility-status.model';

export interface FacilityQuery {
  searchTerm: string;
  status: FacilityStatus | null;
  page: number;
  pageSize: number;
}

export const FIRST_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS: readonly number[] = [10, 25, 50];

export const DEFAULT_FACILITY_QUERY: FacilityQuery = {
  searchTerm: '',
  status: null,
  page: FIRST_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
};

/** Compares by value, not identity, to avoid unnecessary refetches. */
export function isSameFacilityQuery(one: FacilityQuery, other: FacilityQuery): boolean {
  return (
    one.searchTerm === other.searchTerm &&
    one.status === other.status &&
    one.page === other.page &&
    one.pageSize === other.pageSize
  );
}
