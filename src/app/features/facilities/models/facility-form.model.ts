import { FormControl, FormGroup } from '@angular/forms';
import { FacilityStatus } from './facility-status.model';
import { FacilityType } from './facility-type.model';

export interface FacilityFormControls {
  name: FormControl<string>;
  type: FormControl<FacilityType>;
  status: FormControl<FacilityStatus>;
  latitude: FormControl<number>;
  longitude: FormControl<number>;
}

export type FacilityFormGroup = FormGroup<FacilityFormControls>;

export type FacilityFormField = keyof FacilityFormControls;

export const FACILITY_FORM_FIELDS: readonly FacilityFormField[] = [
  'name',
  'type',
  'status',
  'latitude',
  'longitude',
];

export const NAME_MIN_LENGTH = 3;
