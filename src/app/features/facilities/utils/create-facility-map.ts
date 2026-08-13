import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';

export interface FacilityMapHandles {
  map: Map;
  markerSource: VectorSource;
  markerFeature: Feature<Point>;
}

export function createFacilityMap(
  container: HTMLElement,
  centre: number[],
  zoom: number,
  markerStyle: Style,
): FacilityMapHandles {
  const markerFeature = new Feature(new Point(centre));
  const markerSource = new VectorSource({ features: [markerFeature] });
  const map = new Map({
    target: container,
    layers: [
      new TileLayer({ source: new OSM() }),
      new VectorLayer({ source: markerSource, style: markerStyle }),
    ],
    view: new View({ center: centre, zoom }),
  });
  return { map, markerSource, markerFeature };
}

export function toMapCoordinate(longitude: number, latitude: number): number[] {
  return fromLonLat([longitude, latitude]);
}
