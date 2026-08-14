import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityMap } from './facility-map';

const LEEDS = { latitude: 53.7965, longitude: -1.5478 };

const NoopResizeObserver = class {
  readonly observe = (): void => undefined;
  readonly unobserve = (): void => undefined;
  readonly disconnect = (): void => undefined;
};

async function renderMap(
  coordinates = LEEDS,
): Promise<{ fixture: ComponentFixture<FacilityMap>; container: HTMLElement }> {
  const fixture = TestBed.createComponent(FacilityMap);
  fixture.componentRef.setInput('latitude', coordinates.latitude);
  fixture.componentRef.setInput('longitude', coordinates.longitude);
  fixture.componentRef.setInput('label', 'Northfield Substation');
  fixture.detectChanges();
  await fixture.whenStable();

  const container = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
    '.facility-map',
  );
  if (!container) {
    throw new Error('The map container was not rendered');
  }
  return { fixture, container };
}

describe('FacilityMap', () => {
  beforeEach(() => {
    globalThis.ResizeObserver ??= NoopResizeObserver;
    TestBed.configureTestingModule({});
  });

  it('builds a map inside its container', async () => {
    const { container } = await renderMap();

    expect(container.querySelector('.ol-viewport')).not.toBeNull();
  });

  it('releases its DOM on destroy, so repeated visits cannot leak a map', async () => {
    const { fixture, container } = await renderMap();
    expect(container.childElementCount).toBeGreaterThan(0);

    fixture.destroy();

    expect(container.childElementCount).toBe(0);
  });

  it('survives being created and destroyed repeatedly', async () => {
    for (let visit = 0; visit < 3; visit += 1) {
      const { fixture, container } = await renderMap();
      fixture.destroy();
      expect(container.childElementCount).toBe(0);
    }
  });

  it('describes the location in text for readers who cannot see the tiles', async () => {
    const { container } = await renderMap();

    expect(container.getAttribute('role')).toBe('img');
    expect(container.getAttribute('aria-label')).toBe(
      'Map of Northfield Substation, latitude 53.7965, longitude -1.5478',
    );
  });
});
