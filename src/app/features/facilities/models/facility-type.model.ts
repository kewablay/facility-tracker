export const FACILITY_TYPE = {
  SUBSTATION: 'SUBSTATION',
  PUMPING_STATION: 'PUMPING_STATION',
  WATER_TOWER: 'WATER_TOWER',
  RELAY_MAST: 'RELAY_MAST',
  DEPOT: 'DEPOT',
  TREATMENT_PLANT: 'TREATMENT_PLANT',
} as const;

export type FacilityType = (typeof FACILITY_TYPE)[keyof typeof FACILITY_TYPE];

export const FACILITY_TYPE_VALUES: readonly FacilityType[] = Object.values(FACILITY_TYPE);

export const FACILITY_TYPE_LABEL: Record<FacilityType, string> = {
  SUBSTATION: 'Substation',
  PUMPING_STATION: 'Pumping station',
  WATER_TOWER: 'Water tower',
  RELAY_MAST: 'Relay mast',
  DEPOT: 'Depot',
  TREATMENT_PLANT: 'Treatment plant',
};
