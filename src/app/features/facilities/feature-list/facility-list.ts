import { Component, computed, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PageSelection } from '@shared/models/page-selection.model';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { StateContainer } from '@shared/ui/state-container/state-container';
import { FacilityStatus } from '../models/facility-status.model';
import { FacilityFilters } from '../ui/facility-filters/facility-filters';
import { FacilityTableSkeleton } from '../ui/facility-table-skeleton/facility-table-skeleton';
import { FacilityTable } from '../ui/facility-table/facility-table';
import { toFacilityQuery } from '../utils/facility-query-params';
import { FacilitiesListStore } from './facilities-list.store';

const SEARCH_DEBOUNCE_MS = 300;

function toText(value: string | undefined): string {
  return value ?? '';
}

@Component({
  selector: 'app-facility-list',
  providers: [FacilitiesListStore],
  imports: [
    ButtonModule,
    PageHeader,
    StateContainer,
    FacilityFilters,
    FacilityTable,
    FacilityTableSkeleton,
  ],
  templateUrl: './facility-list.html',
  styleUrl: './facility-list.scss',
})
export class FacilityList {
  readonly q = input('', { transform: toText });
  readonly status = input('', { transform: toText });
  readonly page = input('', { transform: toText });
  readonly pageSize = input('', { transform: toText });

  protected readonly store = inject(FacilitiesListStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly searchInput = new Subject<string>();

  protected readonly query = computed(() =>
    toFacilityQuery({
      q: this.q(),
      status: this.status(),
      page: this.page(),
      pageSize: this.pageSize(),
    }),
  );

  protected readonly hasActiveFilters = computed(
    () => this.query().searchTerm !== '' || this.query().status !== null,
  );

  protected readonly errorMessage = computed(() => {
    const state = this.store.state();
    return state.status === 'error' ? state.message : '';
  });

  constructor() {
    effect(() => this.store.query.set(this.query()));

    this.searchInput
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((searchTerm) => this.applyFilters({ q: searchTerm || null, page: null }));
  }

  protected onSearchTermChange(searchTerm: string): void {
    this.searchInput.next(searchTerm);
  }

  protected onStatusChange(status: FacilityStatus | null): void {
    this.applyFilters({ status, page: null });
  }

  protected onClearFilters(): void {
    this.applyFilters({ q: null, status: null, page: null });
  }

  protected onPageChange(selection: PageSelection): void {
    this.applyFilters({ page: selection.page, pageSize: selection.pageSize });
  }

  private applyFilters(queryParams: Params): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
