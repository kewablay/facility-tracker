import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { PagedResult } from '@shared/models/paged-results.model';
import { FacilityNotFoundError, FacilityRequestFailedError } from '../data-access/facility.errors';
import { FacilityRepository } from '../data-access/facility.repository';
import { Facility } from '../models/facility.model';
import { FacilityDetail } from './facility-detail';

const facility: Facility = {
  id: '1',
  name: 'Northfield Substation',
  code: 'NFD-SUB-01',
  type: 'SUBSTATION',
  status: 'MAINTENANCE',
  latitude: 53.7965,
  longitude: -1.5478,
  capacity: 132,
  lastUpdatedAt: new Date('2026-07-28T09:14:00.000Z'),
};

@Component({ template: 'the list' })
class ListStub {}

class StubFacilityRepository extends FacilityRepository {
  getByIdResult: Observable<Facility> = of(facility);

  list(): Observable<PagedResult<Facility>> {
    return of({ items: [facility], total: 1 });
  }

  getById(): Observable<Facility> {
    return this.getByIdResult;
  }

  update(): Observable<Facility> {
    return of(facility);
  }
}

async function visit(
  urls: string[],
  getByIdResult: Observable<Facility> = of(facility),
): Promise<RouterTestingHarness> {
  const repository = new StubFacilityRepository();
  repository.getByIdResult = getByIdResult;

  TestBed.configureTestingModule({
    providers: [
      provideRouter(
        [
          { path: 'facilities', component: ListStub },
          { path: 'facilities/:id', component: FacilityDetail },
        ],
        withComponentInputBinding(),
      ),
      { provide: FacilityRepository, useValue: repository },
    ],
  });

  const harness = await RouterTestingHarness.create();
  for (const url of urls) {
    await harness.navigateByUrl(url);
  }
  await harness.fixture.whenStable();
  return harness;
}

function textOf(harness: RouterTestingHarness): string {
  return (harness.fixture.nativeElement as HTMLElement).textContent ?? '';
}

function backControl(harness: RouterTestingHarness, selector: string): Element | null {
  const element = harness.fixture.nativeElement as HTMLElement;
  const match = [...element.querySelectorAll(selector)].find((node) =>
    node.textContent?.includes('Back to list'),
  );
  return match ?? null;
}

describe('FacilityDetail', () => {
  it('renders every field, with the code and coordinates in the mono face', async () => {
    const harness = await visit(['/facilities/1']);
    const element = harness.fixture.nativeElement as HTMLElement;
    const monoValues = [...element.querySelectorAll('.value.data-mono')].map(
      (node) => node.textContent?.trim() ?? '',
    );

    expect(textOf(harness)).toContain('Northfield Substation');
    expect(textOf(harness)).toContain('Maintenance');
    expect(monoValues).toEqual(['NFD-SUB-01', '53.7965', '-1.5478']);
  });

  it('distinguishes an unknown id from a failed request', async () => {
    const harness = await visit(
      ['/facilities/999'],
      throwError(() => new FacilityNotFoundError('999')),
    );

    expect(textOf(harness)).toContain('That facility does not exist');
    expect(textOf(harness)).toContain('Go to facilities');
    expect(textOf(harness)).not.toContain('Try again');
  });

  it('offers a retry when the service itself fails', async () => {
    const harness = await visit(
      ['/facilities/1'],
      throwError(() => new FacilityRequestFailedError()),
    );

    expect(textOf(harness)).toContain('This facility could not be loaded');
    expect(textOf(harness)).toContain('Try again');
    expect(textOf(harness)).not.toContain('That facility does not exist');
  });

  it('links straight to the list when the screen was opened directly', async () => {
    const harness = await visit(['/facilities/1']);

    expect(backControl(harness, 'a[href="/facilities"]')).not.toBeNull();
    expect(backControl(harness, 'button')).toBeNull();
  });

  it('steps back through history when the reader came from the filtered list', async () => {
    const harness = await visit(['/facilities?q=north&status=MAINTENANCE', '/facilities/1']);
    const location = TestBed.inject(Location);
    let steppedBack = false;
    location.back = () => {
      steppedBack = true;
    };

    expect(backControl(harness, 'a[href="/facilities"]')).toBeNull();
    backControl(harness, 'button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(steppedBack).toBe(true);
  });
});
