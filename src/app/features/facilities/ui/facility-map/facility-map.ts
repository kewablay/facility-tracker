import {
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  afterNextRender,
  computed,
  effect,
  input,
  viewChild,
} from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import { createFacilityMap, toMapCoordinate } from '../../utils/create-facility-map';
import { createMarkerStyle } from '../../utils/create-marker-style';

const DEFAULT_ZOOM = 14;
const FALLBACK_MARKER_FILL = '#1f6f78';
const FALLBACK_MARKER_STROKE = '#ffffff';

@Component({
  selector: 'app-facility-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './facility-map.html',
  styleUrl: './facility-map.scss',
})
export class FacilityMap implements OnDestroy {
  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly zoom = input(DEFAULT_ZOOM);
  readonly label = input('');

  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  private map: Map | null = null;
  private markerSource: VectorSource | null = null;
  private markerFeature: Feature<Point> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  protected readonly ariaLabel = computed(
    () =>
      `Map of ${this.label() || 'the facility'}, latitude ${this.latitude()}, longitude ${this.longitude()}`,
  );

  constructor() {
    afterNextRender(() => this.initialise());
    effect(() => this.moveTo(this.longitude(), this.latitude(), this.zoom()));
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.markerSource?.clear();
    this.map?.setTarget(undefined);
    this.map?.dispose();
    this.resizeObserver = null;
    this.map = null;
    this.markerSource = null;
    this.markerFeature = null;
  }

  private initialise(): void {
    const container = this.mapContainer().nativeElement;
    const handles = createFacilityMap(
      container,
      toMapCoordinate(this.longitude(), this.latitude()),
      this.zoom(),
      this.readMarkerStyle(container),
    );
    this.map = handles.map;
    this.markerSource = handles.markerSource;
    this.markerFeature = handles.markerFeature;

    this.resizeObserver = new ResizeObserver(() => this.map?.updateSize());
    this.resizeObserver.observe(container);
    this.map.updateSize();
  }

  private readMarkerStyle(container: HTMLElement): Style {
    const tokens = getComputedStyle(container);
    return createMarkerStyle(
      tokens.getPropertyValue('--petrol').trim() || FALLBACK_MARKER_FILL,
      tokens.getPropertyValue('--surface').trim() || FALLBACK_MARKER_STROKE,
    );
  }

  private moveTo(longitude: number, latitude: number, zoom: number): void {
    if (!this.map || !this.markerFeature) {
      return;
    }
    const centre = toMapCoordinate(longitude, latitude);
    this.markerFeature.getGeometry()?.setCoordinates(centre);
    this.map.getView().setCenter(centre);
    this.map.getView().setZoom(zoom);
  }
}
