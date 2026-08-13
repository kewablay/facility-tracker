import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { PagedResult } from '@shared/models/paged-results.model';
import { FacilityRequestFailedError } from '../data-access/facility.errors';
import { FacilityRepository } from '../data-access/facility.repository';
import { Facility } from '../models/facility.model';
import { FacilityList } from './facility-list';

const facility: Facility = {
  id: '1',
  name: 'Northfield Substation',
  code: 'NFD-SUB-01',
  type: 'SUBSTATION',
  status: 'ACTIVE',
  latitude: 53.7965,
  longitude: -1.5478,
  capacity: 132,
  lastUpdatedAt: new Date('2026-07-28T09:14:00.000Z'),
};

class StubFacilityRepository extends FacilityRepository {
  listResult: Observable<PagedResult<Facility>> = NEVER;

  list(): Observable<PagedResult<Facility>> {
    return this.listResult;
  }

  getById(): Observable<Facility> {
    return of(facility);
  }

  update(): Observable<Facility> {
    return of(facility);
  }
}

async function renderList(
  listResult: Observable<PagedResult<Facility>>,
  inputs: Record<string, string> = {},
  settle: 'whenStable' | 'oneTick' = 'whenStable',
): Promise<ComponentFixture<FacilityList>> {
  const repository = new StubFacilityRepository();
  repository.listResult = listResult;

  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: FacilityRepository, useValue: repository }],
  });

  const fixture = TestBed.createComponent(FacilityList);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }

  if (settle === 'whenStable') {
    await fixture.whenStable();
    return fixture;
  }

  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
  return fixture;
}

function textOf(fixture: ComponentFixture<FacilityList>): string {
  return (fixture.nativeElement as HTMLElement).textContent ?? '';
}

describe('FacilityList', () => {
  it('renders skeleton rows while the request is in flight', async () => {
    const fixture = await renderList(NEVER, {}, 'oneTick');
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-facility-table-skeleton')).not.toBeNull();
    expect(element.querySelector('app-facility-table')).toBeNull();
    expect(textOf(fixture)).toContain('Loading facilities');
  });

  it('renders the failure and a way to recover when the request errors', async () => {
    const fixture = await renderList(throwError(() => new FacilityRequestFailedError()));

    expect(textOf(fixture)).toContain('Facilities could not be loaded');
    expect(textOf(fixture)).toContain('The facility service did not respond');
    expect(textOf(fixture)).toContain('Try again');
    expect((fixture.nativeElement as HTMLElement).querySelector('app-facility-table')).toBeNull();
  });

  it('renders a row per facility on success', async () => {
    const fixture = await renderList(of({ items: [facility], total: 1 }));
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-facility-table')).not.toBeNull();
    expect(textOf(fixture)).toContain('Northfield Substation');
    expect(textOf(fixture)).toContain('NFD-SUB-01');
    expect(textOf(fixture)).toContain('Substation');
  });

  it('offers to clear the filters when a filtered search returns nothing', async () => {
    const fixture = await renderList(of({ items: [], total: 0 }), { q: 'zzzz' });

    expect(textOf(fixture)).toContain('No facilities match these filters');
    expect(textOf(fixture)).toContain('Clear filters');
  });

  it('distinguishes an unfiltered empty result from a filtered one', async () => {
    const fixture = await renderList(of({ items: [], total: 0 }));

    expect(textOf(fixture)).toContain('No facilities are being tracked');
    expect(textOf(fixture)).not.toContain('No facilities match these filters');
  });
});
