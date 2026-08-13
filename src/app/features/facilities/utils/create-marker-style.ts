import { Circle, Fill, Stroke, Style } from 'ol/style';

const MARKER_RADIUS_PX = 7;
const MARKER_STROKE_WIDTH_PX = 2;

export function createMarkerStyle(fillColour: string, strokeColour: string): Style {
  return new Style({
    image: new Circle({
      radius: MARKER_RADIUS_PX,
      fill: new Fill({ color: fillColour }),
      stroke: new Stroke({ color: strokeColour, width: MARKER_STROKE_WIDTH_PX }),
    }),
  });
}
