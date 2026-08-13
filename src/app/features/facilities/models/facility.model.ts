import { FacilityStatus } from './facility-status.model';
import { FacilityType } from './facility-type.model';

export interface Facility {
  id: string;
  name: string;
  code: string;
  type: FacilityType;
  status: FacilityStatus;
  latitude: number;
  longitude: number;
  capacity: number;
  lastUpdatedAt: Date;
}

// Id, code and capacity are not editable.
export type FacilityUpdate = Pick<Facility, 'name' | 'type' | 'status' | 'latitude' | 'longitude'>;
