import { Facility } from '../models/facility.model';
import { FacilityDto } from './dto/facility.dto';
import { toFacility, toFacilityDto } from './facility.mapper';

const dto: FacilityDto = {
  facility_id: '42',
  facility_name: 'Northfield Substation',
  facility_code: 'NFD-SUB-01',
  facility_type: 'SUBSTATION',
  operational_status: 'ACTIVE',
  latitude: 53.7965,
  longitude: -1.5478,
  rated_capacity: 132,
  last_updated_at: '2026-07-28T09:14:00.000Z',
};

describe('facility mapper', () => {
  describe('toFacility', () => {
    it('renames every snake_case key to its domain equivalent', () => {
      expect(toFacility(dto)).toMatchObject({
        id: '42',
        name: 'Northfield Substation',
        code: 'NFD-SUB-01',
        type: 'SUBSTATION',
        status: 'ACTIVE',
        latitude: 53.7965,
        longitude: -1.5478,
        capacity: 132,
      });
    });

    it('converts the ISO string into a Date instance', () => {
      const facility = toFacility(dto);

      expect(facility.lastUpdatedAt).toBeInstanceOf(Date);
      expect(facility.lastUpdatedAt.toISOString()).toBe('2026-07-28T09:14:00.000Z');
    });
  });

  describe('toFacilityDto', () => {
    it('converts the Date back into an ISO string', () => {
      const facility: Facility = toFacility(dto);

      expect(toFacilityDto(facility).last_updated_at).toBe('2026-07-28T09:14:00.000Z');
    });

    it('round trips a DTO without losing or altering a field', () => {
      expect(toFacilityDto(toFacility(dto))).toEqual(dto);
    });
  });
});
