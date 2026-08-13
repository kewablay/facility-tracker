import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const LATITUDE_MIN = -90;
export const LATITUDE_MAX = 90;
export const LONGITUDE_MIN = -180;
export const LONGITUDE_MAX = 180;

function inRange(min: number, max: number, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }
    const value = Number(control.value);
    const withinRange = Number.isFinite(value) && value >= min && value <= max;
    return withinRange ? null : { [errorKey]: { min, max } };
  };
}

export const latitudeValidator = inRange(LATITUDE_MIN, LATITUDE_MAX, 'latitudeRange');
export const longitudeValidator = inRange(LONGITUDE_MIN, LONGITUDE_MAX, 'longitudeRange');
