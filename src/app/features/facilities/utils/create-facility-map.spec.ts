import { toLonLat } from 'ol/proj';
import { toMapCoordinate } from './create-facility-map';

const LEEDS = { latitude: 53.7965, longitude: -1.5478 };
const LERWICK = { latitude: 60.1546, longitude: -1.1494 };
const PRECISION = 6;

describe('toMapCoordinate', () => {
  it('round trips back to the latitude and longitude it was given', () => {
    const [longitude, latitude] = toLonLat(toMapCoordinate(LEEDS.longitude, LEEDS.latitude));

    expect(longitude).toBeCloseTo(LEEDS.longitude, PRECISION);
    expect(latitude).toBeCloseTo(LEEDS.latitude, PRECISION);
  });

  it('does not swap the pair, which would move a Yorkshire facility into the Indian Ocean', () => {
    const correct = toMapCoordinate(LEEDS.longitude, LEEDS.latitude);
    const swapped = toMapCoordinate(LEEDS.latitude, LEEDS.longitude);

    const [correctLongitude, correctLatitude] = toLonLat(correct);
    expect(correctLongitude).toBeLessThan(0);
    expect(correctLatitude).toBeGreaterThan(50);
    expect(swapped).not.toEqual(correct);
  });

  it('projects a high latitude without distorting it', () => {
    const [longitude, latitude] = toLonLat(toMapCoordinate(LERWICK.longitude, LERWICK.latitude));

    expect(longitude).toBeCloseTo(LERWICK.longitude, PRECISION);
    expect(latitude).toBeCloseTo(LERWICK.latitude, PRECISION);
  });
});
