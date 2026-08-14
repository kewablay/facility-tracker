import { FormControl } from '@angular/forms';
import { latitudeValidator, longitudeValidator } from './coordinate.validators';

function check(validator: typeof latitudeValidator, value: unknown): boolean {
  return validator(new FormControl(value)) === null;
}

describe('latitudeValidator', () => {
  it('accepts the whole valid range including both boundaries', () => {
    expect(check(latitudeValidator, -90)).toBe(true);
    expect(check(latitudeValidator, 90)).toBe(true);
    expect(check(latitudeValidator, 0)).toBe(true);
    expect(check(latitudeValidator, 53.7965)).toBe(true);
  });

  it('rejects a value one step outside either boundary', () => {
    expect(check(latitudeValidator, -91)).toBe(false);
    expect(check(latitudeValidator, 91)).toBe(false);
    expect(check(latitudeValidator, -90.0001)).toBe(false);
    expect(check(latitudeValidator, 90.0001)).toBe(false);
  });

  it('rejects anything that is not a finite number', () => {
    expect(check(latitudeValidator, 'north')).toBe(false);
    expect(check(latitudeValidator, Number.NaN)).toBe(false);
    expect(check(latitudeValidator, Number.POSITIVE_INFINITY)).toBe(false);
  });

  it('leaves an empty control to the required validator', () => {
    expect(check(latitudeValidator, null)).toBe(true);
    expect(check(latitudeValidator, '')).toBe(true);
  });

  it('reports the range it enforced, so the message does not restate the numbers', () => {
    expect(latitudeValidator(new FormControl(91))).toEqual({
      latitudeRange: { min: -90, max: 90 },
    });
  });
});

describe('longitudeValidator', () => {
  it('accepts the whole valid range including both boundaries', () => {
    expect(check(longitudeValidator, -180)).toBe(true);
    expect(check(longitudeValidator, 180)).toBe(true);
    expect(check(longitudeValidator, -1.5478)).toBe(true);
  });

  it('rejects a value one step outside either boundary', () => {
    expect(check(longitudeValidator, -181)).toBe(false);
    expect(check(longitudeValidator, 181)).toBe(false);
  });

  it('accepts a longitude that a latitude validator would reject', () => {
    expect(check(longitudeValidator, 120)).toBe(true);
    expect(check(latitudeValidator, 120)).toBe(false);
  });

  it('rejects anything that is not a finite number', () => {
    expect(check(longitudeValidator, 'east')).toBe(false);
  });
});
