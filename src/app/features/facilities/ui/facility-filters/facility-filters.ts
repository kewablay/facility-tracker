import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  FACILITY_STATUS_LABEL,
  FACILITY_STATUS_VALUES,
  FacilityStatus,
} from '../../models/facility-status.model';

interface StatusOption {
  label: string;
  value: FacilityStatus | null;
}

@Component({
  selector: 'app-facility-filters',
  imports: [FormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './facility-filters.html',
  styleUrl: './facility-filters.scss',
})
export class FacilityFilters {
  readonly searchTerm = input.required<string>();
  readonly status = input.required<FacilityStatus | null>();
  readonly resultCount = input(0);
  readonly showResultCount = input(false);

  readonly searchTermChange = output<string>();
  readonly statusChange = output<FacilityStatus | null>();
  readonly clearFilters = output<void>();

  protected readonly hasActiveFilters = computed(
    () => this.searchTerm() !== '' || this.status() !== null,
  );

  protected readonly resultSummary = computed(() =>
    this.resultCount() === 1 ? '1 facility' : `${this.resultCount()} facilities`,
  );

  protected readonly statusOptions: StatusOption[] = [
    { label: 'All statuses', value: null },
    ...FACILITY_STATUS_VALUES.map((value) => ({ label: FACILITY_STATUS_LABEL[value], value })),
  ];

  protected onSearchInput(event: Event): void {
    this.searchTermChange.emit((event.target as HTMLInputElement).value);
  }
}
