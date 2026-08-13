import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FacilityFormControls,
  FacilityFormGroup,
  NAME_MIN_LENGTH,
} from '../models/facility-form.model';
import { Facility } from '../models/facility.model';
import { latitudeValidator, longitudeValidator } from './coordinate.validators';

export function createFacilityForm(facility: Facility): FacilityFormGroup {
  return new FormGroup<FacilityFormControls>({
    name: new FormControl(facility.name, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(NAME_MIN_LENGTH)],
    }),
    type: new FormControl(facility.type, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl(facility.status, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    latitude: new FormControl(facility.latitude, {
      nonNullable: true,
      validators: [Validators.required, latitudeValidator],
    }),
    longitude: new FormControl(facility.longitude, {
      nonNullable: true,
      validators: [Validators.required, longitudeValidator],
    }),
  });
}
