import { ValidationErrors } from '@angular/forms';
import { FacilityFormField, NAME_MIN_LENGTH } from '../models/facility-form.model';
import { LATITUDE_MAX, LATITUDE_MIN, LONGITUDE_MAX, LONGITUDE_MIN } from './coordinate.validators';

const REQUIRED: Record<FacilityFormField, string> = {
  name: 'Enter a name for this facility.',
  type: 'Choose a facility type.',
  status: 'Choose a status.',
  latitude: 'Enter a latitude.',
  longitude: 'Enter a longitude.',
};

export function toFieldErrorMessage(
  field: FacilityFormField,
  errors: ValidationErrors | null,
): string {
  if (!errors) {
    return '';
  }
  if (errors['required']) {
    return REQUIRED[field];
  }
  if (errors['minlength']) {
    return `The name must be at least ${NAME_MIN_LENGTH} characters.`;
  }
  if (errors['latitudeRange']) {
    return `Latitude must be between ${LATITUDE_MIN} and ${LATITUDE_MAX}.`;
  }
  if (errors['longitudeRange']) {
    return `Longitude must be between ${LONGITUDE_MIN} and ${LONGITUDE_MAX}.`;
  }
  return REQUIRED[field];
}
