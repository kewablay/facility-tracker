import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FacilityRepository } from '../data-access/facility.repository';
import { InMemoryFacilityRepository } from '../data-access/in-memory-facility.repository';
import { routes } from '../../../app.routes';

const SEED_SIZE = 15;
const DEFAULT_PAGE_SIZE = 10;

describe('the facilities home page', () => {
  async function openHomePage(url = '/facilities'): Promise<RouterTestingHarness> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: FacilityRepository, useClass: InMemoryFacilityRepository },
      ],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();
    return harness;
  }

  it('lists facilities without the reader searching for anything', async () => {
    const harness = await openHomePage();
    const element = harness.fixture.nativeElement as HTMLElement;

    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(DEFAULT_PAGE_SIZE);
    expect(element.textContent).toContain('Northfield Substation');
    expect(element.textContent).toContain(`${SEED_SIZE} facilities`);
  });

  it('shows the page heading and the search control alongside the data', async () => {
    const harness = await openHomePage();
    const element = harness.fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Facilities');
    expect(element.querySelector('#facility-search')).not.toBeNull();
    expect(element.querySelector('app-facility-table')).not.toBeNull();
  });

  it('makes each row a link to its facility', async () => {
    const harness = await openHomePage();
    const element = harness.fixture.nativeElement as HTMLElement;
    const firstRow = element.querySelector('tbody tr');
    const link = firstRow?.querySelector<HTMLAnchorElement>('a[href]');

    expect(link?.getAttribute('href')).toBe('/facilities/1');
    expect(link?.textContent).toContain('Northfield Substation');
  });

  it('keeps the row action reachable on top of the row link', async () => {
    const harness = await openHomePage();
    const firstRow = (harness.fixture.nativeElement as HTMLElement).querySelector('tbody tr');
    const edit = firstRow?.querySelector('button');

    expect(edit?.textContent).toContain('Edit');
    expect(edit?.getAttribute('aria-label')).toBe('Edit Northfield Substation');
  });

  it('reaches the same screen from the root address', async () => {
    const harness = await openHomePage('/');

    expect((harness.fixture.nativeElement as HTMLElement).textContent).toContain(
      'Northfield Substation',
    );
  });
});
