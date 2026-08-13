import { Location } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { StateContainer } from '@shared/ui/state-container/state-container';
import { FacilityStore } from '../data-access/facility.store';
import { FACILITIES_LIST_PATH } from '../facilities.routes';
import { FacilityMap } from '../ui/facility-map/facility-map';
import { FacilitySummary } from '../ui/facility-summary/facility-summary';

@Component({
  selector: 'app-facility-detail',
  providers: [FacilityStore],
  imports: [
    RouterLink,
    ButtonModule,
    SkeletonModule,
    PageHeader,
    StateContainer,
    FacilitySummary,
    FacilityMap,
  ],
  templateUrl: './facility-detail.html',
  styleUrl: './facility-detail.scss',
})
export class FacilityDetail {
  readonly id = input.required<string>();

  protected readonly store = inject(FacilityStore);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly listPath = FACILITIES_LIST_PATH;
  protected readonly arrivedFromList = this.detectArrivalFromList();

  protected readonly facility = computed(() => {
    const state = this.store.state();
    return state.status === 'success' ? state.data : null;
  });

  protected readonly errorMessage = computed(() => {
    const state = this.store.state();
    return state.status === 'error' ? state.message : '';
  });

  constructor() {
    effect(() => this.store.facilityId.set(this.id()));
  }

  protected backToList(): void {
    this.location.back();
  }

  private detectArrivalFromList(): boolean {
    const previous = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl;
    if (!previous) {
      return false;
    }
    return this.router.serializeUrl(previous).split('?')[0] === FACILITIES_LIST_PATH;
  }
}
