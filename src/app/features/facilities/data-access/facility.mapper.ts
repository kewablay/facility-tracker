import { Facility } from '../models/facility.model';
import { FacilityDto } from './dto/facility.dto';

export function toFacility(dto: FacilityDto): Facility {
  return {
    id: dto.facility_id,
    name: dto.facility_name,
    code: dto.facility_code,
    type: dto.facility_type,
    status: dto.operational_status,
    latitude: dto.latitude,
    longitude: dto.longitude,
    capacity: dto.rated_capacity,
    lastUpdatedAt: new Date(dto.last_updated_at),
  };
}

export function toFacilityDto(facility: Facility): FacilityDto {
  return {
    facility_id: facility.id,
    facility_name: facility.name,
    facility_code: facility.code,
    facility_type: facility.type,
    operational_status: facility.status,
    latitude: facility.latitude,
    longitude: facility.longitude,
    rated_capacity: facility.capacity,
    last_updated_at: facility.lastUpdatedAt.toISOString(),
  };
}
