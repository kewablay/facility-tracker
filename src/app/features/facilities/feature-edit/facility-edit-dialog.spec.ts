import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subject, of, throwError } from 'rxjs';
import { PagedResult } from '@shared/models/paged-results.model';
import { FacilityRequestFailedError } from '../data-access/facility.errors';
import { FacilityRepository } from '../data-access/facility.repository';
import { Facility, FacilityUpdate } from '../models/facility.model';
import { FacilityList } from '../feature-list/facility-list';

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
  updateCalls: FacilityUpdate[] = [];
  listCalls = 0;
  updateResult: Observable<Facility> = of(facility);

  list(): Observable<PagedResult<Facility>> {
    this.listCalls += 1;
    return of({ items: [facility], total: 1 });
  }

  getById(): Observable<Facility> {
    return of(facility);
  }

  update(_id: string, changes: FacilityUpdate): Observable<Facility> {
    this.updateCalls.push(changes);
    return this.updateResult;
  }
}

async function openDialogFromList(updateResult: Observable<Facility> = of(facility)) {
  const repository = new StubFacilityRepository();
  repository.updateResult = updateResult;

  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      MessageService,
      { provide: FacilityRepository, useValue: repository },
    ],
  });

  const fixture = TestBed.createComponent(FacilityList);
  await fixture.whenStable();
  fixture.detectChanges();

  clickButton(fixture.nativeElement as HTMLElement, 'Edit');
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, repository, element: document.body };
}

function clickButton(root: HTMLElement, label: string): void {
  const match = [...root.querySelectorAll('button')].find((button) =>
    button.textContent?.includes(label),
  );
  if (!match) {
    throw new Error(`No button labelled ${label}`);
  }
  match.click();
}

function fieldValue(element: HTMLElement, id: string): string {
  return element.querySelector<HTMLInputElement>(`#${id}`)?.value ?? '';
}

function setField(element: HTMLElement, id: string, value: string): void {
  const input = element.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    throw new Error(`No field ${id}`);
  }
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function submit(element: HTMLElement): void {
  element.querySelector('form')?.dispatchEvent(new Event('submit'));
}

function dialog(element: HTMLElement): Element | null {
  return element.querySelector('[role="dialog"]');
}

async function settle(fixture: ComponentFixture<FacilityList>): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('FacilityEditDialog', () => {
  it('opens filled from the row, without fetching the facility again', async () => {
    const { element, repository } = await openDialogFromList();

    expect(dialog(element)).not.toBeNull();
    expect(fieldValue(element, 'facility-name')).toBe('Northfield Substation');
    expect(fieldValue(element, 'facility-latitude')).toBe('53.7965');
    expect(repository.listCalls).toBe(1);
  });

  it('reports an out of range latitude specifically, not vaguely', async () => {
    const { fixture, element } = await openDialogFromList();

    setField(element, 'facility-latitude', '91');
    submit(element);
    await settle(fixture);

    expect(element.textContent).toContain('Latitude must be between -90 and 90');
  });

  it('does not send a request when the form is invalid', async () => {
    const { fixture, element, repository } = await openDialogFromList();

    setField(element, 'facility-name', 'ab');
    submit(element);
    await settle(fixture);

    expect(repository.updateCalls).toHaveLength(0);
    expect(element.textContent).toContain('The name must be at least 3 characters');
  });

  it('moves focus to the first field that failed', async () => {
    const { fixture, element } = await openDialogFromList();

    setField(element, 'facility-name', '');
    setField(element, 'facility-latitude', '91');
    submit(element);
    await settle(fixture);

    expect(document.activeElement?.id).toBe('facility-name');
  });

  it('sends one request even when submitted twice in a row', async () => {
    const inFlight = new Subject<Facility>();
    const { fixture, element, repository } = await openDialogFromList(inFlight);

    submit(element);
    submit(element);
    await settle(fixture);

    expect(repository.updateCalls).toHaveLength(1);
    inFlight.complete();
  });

  it('keeps everything the reader typed when the save fails, and stays open', async () => {
    const { fixture, element } = await openDialogFromList(
      throwError(() => new FacilityRequestFailedError()),
    );

    setField(element, 'facility-name', 'Northfield Primary Substation');
    submit(element);
    await settle(fixture);

    expect(dialog(element)).not.toBeNull();
    expect(fieldValue(element, 'facility-name')).toBe('Northfield Primary Substation');
    expect(element.querySelector<HTMLInputElement>('#facility-name')?.disabled).toBe(false);
  });

  it('sends only the editable fields, not the whole facility', async () => {
    const { fixture, element, repository } = await openDialogFromList();

    setField(element, 'facility-name', 'Northfield Primary Substation');
    submit(element);
    await settle(fixture);

    expect(repository.updateCalls[0]).toEqual({
      name: 'Northfield Primary Substation',
      type: 'SUBSTATION',
      status: 'ACTIVE',
      latitude: 53.7965,
      longitude: -1.5478,
    });
  });

  it('closes and refreshes the list after a successful save', async () => {
    const { fixture, element, repository } = await openDialogFromList();

    submit(element);
    await settle(fixture);

    expect(dialog(element)).toBeNull();
    expect(repository.listCalls).toBe(2);
  });

  it('closes without saving when cancelled', async () => {
    const { fixture, element, repository } = await openDialogFromList();

    clickButton(element, 'Cancel');
    await settle(fixture);

    expect(dialog(element)).toBeNull();
    expect(repository.updateCalls).toHaveLength(0);
  });
});
