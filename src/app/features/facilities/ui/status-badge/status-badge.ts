import { Component, computed, input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { FACILITY_STATUS_LABEL, FacilityStatus } from '../../models/facility-status.model';

type BadgeSeverity = 'success' | 'warn' | 'secondary';

const SEVERITY_BY_STATUS: Record<FacilityStatus, BadgeSeverity> = {
  ACTIVE: 'success',
  MAINTENANCE: 'warn',
  INACTIVE: 'secondary',
};

@Component({
  selector: 'app-status-badge',
  imports: [BadgeModule],
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  readonly status = input.required<FacilityStatus>();

  protected readonly label = computed(() => FACILITY_STATUS_LABEL[this.status()]);
  protected readonly severity = computed(() => SEVERITY_BY_STATUS[this.status()]);
}
