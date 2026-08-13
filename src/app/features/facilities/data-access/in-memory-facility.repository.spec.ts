import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_FACILITY_QUERY, FacilityQuery } from '../models/facility-query.model';
import { FacilityNotFoundError, FacilityRequestFailedError } from './facility.errors';
import { FacilityRepository } from './facility.repository';
import {
  InMemoryFacilityRepository,
  SIMULATE_FAILURE_PARAM,
} from './in-memory-facility.repository';

const SEED_SIZE = 15;
const INACTIVE_COUNT = 3;

function queryWith(overrides: Partial<FacilityQuery>): FacilityQuery {
  return { ...DEFAULT_FACILITY_QUERY, ...overrides };
}

describe('InMemoryFacilityRepository', () => {
  let repository: FacilityRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: FacilityRepository, useClass: InMemoryFacilityRepository }],
    });
    repository = TestBed.inject(FacilityRepository);
  });

  describe('list', () => {
    it('matches partial names regardless of case', async () => {
      const result = await firstValueFrom(repository.list(queryWith({ searchTerm: 'nOrTh' })));

      expect(result.total).toBe(3);
      expect(result.items.map((facility) => facility.name)).toEqual([
        'Northfield Substation',
        'North Quay Pumping Station',
        'Northgate Relay Mast',
      ]);
    });

    it('matches on the facility code as well as the name', async () => {
      const result = await firstValueFrom(repository.list(queryWith({ searchTerm: 'ptc-sub' })));

      expect(result.items.map((facility) => facility.code)).toEqual(['PTC-SUB-07']);
    });

    it('returns an empty page and a zero total when nothing matches', async () => {
      const result = await firstValueFrom(repository.list(queryWith({ searchTerm: 'zzzz' })));

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('narrows the result set to the requested status', async () => {
      const result = await firstValueFrom(repository.list(queryWith({ status: 'INACTIVE' })));

      expect(result.total).toBe(INACTIVE_COUNT);
      expect(result.items.every((facility) => facility.status === 'INACTIVE')).toBe(true);
    });

    it('combines a search term with a status filter', async () => {
      const result = await firstValueFrom(
        repository.list(queryWith({ searchTerm: 'north', status: 'MAINTENANCE' })),
      );

      expect(result.items.map((facility) => facility.name)).toEqual(['Northgate Relay Mast']);
    });

    it('returns only the requested page while reporting the unpaginated total', async () => {
      const firstPage = await firstValueFrom(repository.list(queryWith({ page: 1, pageSize: 10 })));
      const secondPage = await firstValueFrom(
        repository.list(queryWith({ page: 2, pageSize: 10 })),
      );

      expect(firstPage.items).toHaveLength(10);
      expect(secondPage.items).toHaveLength(SEED_SIZE - 10);
      expect(firstPage.total).toBe(SEED_SIZE);
      expect(secondPage.total).toBe(SEED_SIZE);
    });

    it('does not repeat an item across pages', async () => {
      const firstPage = await firstValueFrom(repository.list(queryWith({ page: 1, pageSize: 5 })));
      const secondPage = await firstValueFrom(repository.list(queryWith({ page: 2, pageSize: 5 })));
      const ids = [...firstPage.items, ...secondPage.items].map((facility) => facility.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it('returns an empty page past the end of the result set', async () => {
      const result = await firstValueFrom(repository.list(queryWith({ page: 99 })));

      expect(result.items).toEqual([]);
      expect(result.total).toBe(SEED_SIZE);
    });
  });

  describe('the simulated failure switch', () => {
    afterEach(() => {
      window.history.replaceState({}, '', '/');
    });

    it('fails once when the switch is in the URL, then lets the retry succeed', async () => {
      window.history.replaceState({}, '', `/?${SIMULATE_FAILURE_PARAM}=true`);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: FacilityRepository, useClass: InMemoryFacilityRepository }],
      });
      const failing = TestBed.inject(FacilityRepository);

      await expect(firstValueFrom(failing.list(DEFAULT_FACILITY_QUERY))).rejects.toBeInstanceOf(
        FacilityRequestFailedError,
      );

      const retry = await firstValueFrom(failing.list(DEFAULT_FACILITY_QUERY));
      expect(retry.total).toBe(SEED_SIZE);
    });

    it('does not fail when the switch is absent', async () => {
      const result = await firstValueFrom(repository.list(DEFAULT_FACILITY_QUERY));

      expect(result.total).toBe(SEED_SIZE);
    });
  });

  describe('getById', () => {
    it('returns the facility with a mapped Date', async () => {
      const facility = await firstValueFrom(repository.getById('1'));

      expect(facility.name).toBe('Northfield Substation');
      expect(facility.lastUpdatedAt).toBeInstanceOf(Date);
    });

    it('throws FacilityNotFoundError for an unknown id', async () => {
      await expect(firstValueFrom(repository.getById('999'))).rejects.toBeInstanceOf(
        FacilityNotFoundError,
      );
    });
  });

  describe('update', () => {
    it('persists the change and stamps a new lastUpdatedAt', async () => {
      const before = await firstValueFrom(repository.getById('1'));

      const updated = await firstValueFrom(
        repository.update('1', {
          name: 'Northfield Primary Substation',
          type: before.type,
          status: 'MAINTENANCE',
          latitude: before.latitude,
          longitude: before.longitude,
        }),
      );
      const reloaded = await firstValueFrom(repository.getById('1'));

      expect(updated.name).toBe('Northfield Primary Substation');
      expect(reloaded.status).toBe('MAINTENANCE');
      expect(reloaded.lastUpdatedAt.getTime()).toBeGreaterThan(before.lastUpdatedAt.getTime());
    });

    it('throws FacilityNotFoundError for an unknown id', async () => {
      const changes = {
        name: 'Nowhere',
        type: 'DEPOT',
        status: 'ACTIVE',
        latitude: 0,
        longitude: 0,
      } as const;

      await expect(firstValueFrom(repository.update('999', changes))).rejects.toBeInstanceOf(
        FacilityNotFoundError,
      );
    });
  });
});
