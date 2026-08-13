import { Component, computed, input } from '@angular/core';
import { FACILITY_STATUS_LABEL, FacilityStatus } from '../../models/facility-status.model';

@Component({
  selector: 'app-status-tag',
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.scss',
})
export class StatusTag {
  readonly status = input.required<FacilityStatus>();

  protected readonly label = computed(() => FACILITY_STATUS_LABEL[this.status()]);
  protected readonly toneClass = computed(() => `tag--${this.status().toLowerCase()}`);
}
