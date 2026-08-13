import { FacilityRequestFailedError } from '../data-access/facility.errors';

const SERVICE_UNAVAILABLE = 'The facility service did not respond.';
const UNEXPECTED = 'The request could not be completed.';

export function toFacilityErrorMessage(error: unknown): string {
  return error instanceof FacilityRequestFailedError ? SERVICE_UNAVAILABLE : UNEXPECTED;
}
