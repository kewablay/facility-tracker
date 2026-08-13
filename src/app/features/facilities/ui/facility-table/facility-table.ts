import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PageSelection } from '@shared/models/page-selection.model';
import { PAGE_SIZE_OPTIONS } from '../../models/facility-query.model';
import { FACILITY_TYPE_LABEL } from '../../models/facility-type.model';
import { Facility } from '../../models/facility.model';
import { StatusTag } from '../status-tag/status-tag';

@Component({
  selector: 'app-facility-table',
  imports: [DatePipe, RouterLink, TableModule, StatusTag],
  templateUrl: './facility-table.html',
  styleUrl: './facility-table.scss',
})
export class FacilityTable {
  readonly facilities = input.required<Facility[]>();
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();

  readonly pageChange = output<PageSelection>();

  protected readonly typeLabel = FACILITY_TYPE_LABEL;
  protected readonly pageSizeOptions = [...PAGE_SIZE_OPTIONS];
  protected readonly tableStyle = { 'min-width': 'var(--table-min-width)' };
  protected readonly firstRecordIndex = computed(() => (this.page() - 1) * this.pageSize());
  protected readonly regionLabel = computed(() => `Facilities, ${this.total()} matching`);

  protected asFacility(row: unknown): Facility {
    return row as Facility;
  }

  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const pageSize = event.rows ?? this.pageSize();
    const page = Math.floor((event.first ?? 0) / pageSize) + 1;
    if (page !== this.page() || pageSize !== this.pageSize()) {
      this.pageChange.emit({ page, pageSize });
    }
  }
}
