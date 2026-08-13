import { FacilityStatus } from '../../models/facility-status.model';
import { FacilityType } from '../../models/facility-type.model';

/**
 * The wire shape. Deliberately not the domain model: snake_case keys, a different name for
 * capacity, and a date carried as an ISO 8601 string. Keeping this separate means a change
 * to the API contract is absorbed by the mapper instead of reaching every component.
 */
export interface FacilityDto {
  facility_id: string;
  facility_name: string;
  facility_code: string;
  facility_type: FacilityType;
  operational_status: FacilityStatus;
  latitude: number;
  longitude: number;
  rated_capacity: number;
  last_updated_at: string;
}
