import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DataValue } from '@shared/ui/data-value/data-value';
import { FACILITY_TYPE_LABEL } from '../../models/facility-type.model';
import { Facility } from '../../models/facility.model';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-facility-summary',
  imports: [DatePipe, DataValue, StatusBadge],
  templateUrl: './facility-summary.html',
  styleUrl: './facility-summary.scss',
})
export class FacilitySummary {
  readonly facility = input.required<Facility>();

  protected readonly typeLabel = FACILITY_TYPE_LABEL;
}
