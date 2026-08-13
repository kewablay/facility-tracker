export const FACILITY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type FacilityStatus = (typeof FACILITY_STATUS)[keyof typeof FACILITY_STATUS];

export const FACILITY_STATUS_VALUES: readonly FacilityStatus[] = Object.values(FACILITY_STATUS);

export const FACILITY_STATUS_LABEL: Record<FacilityStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  MAINTENANCE: 'Maintenance',
};

export function isFacilityStatus(value: string | null | undefined): value is FacilityStatus {
  return value != null && Object.hasOwn(FACILITY_STATUS, value);
}
