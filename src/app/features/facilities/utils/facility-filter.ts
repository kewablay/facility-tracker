import { FacilityQuery } from '../models/facility-query.model';
import { Facility } from '../models/facility.model';

function matchesSearchTerm(facility: Facility, searchTerm: string): boolean {
  if (searchTerm === '') {
    return true;
  }
  return (
    facility.name.toLowerCase().includes(searchTerm) ||
    facility.code.toLowerCase().includes(searchTerm)
  );
}

export function filterFacilities(facilities: Facility[], query: FacilityQuery): Facility[] {
  const searchTerm = query.searchTerm.trim().toLowerCase();
  return facilities.filter(
    (facility) =>
      matchesSearchTerm(facility, searchTerm) &&
      (query.status === null || facility.status === query.status),
  );
}
