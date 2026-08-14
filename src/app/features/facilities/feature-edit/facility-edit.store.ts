import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { NotificationService } from '@core/notifications/notification.service';
import { FacilityRepository } from '../data-access/facility.repository';
import { Facility, FacilityUpdate } from '../models/facility.model';
import { toFacilityErrorMessage } from '../utils/facility-error-message';

const SAVED_MESSAGE = 'Changes saved';
const NOT_SAVED_PREFIX = 'Changes were not saved.';

@Injectable()
export class FacilityEditStore {
  private readonly repository = inject(FacilityRepository);
  private readonly notifications = inject(NotificationService);

  readonly saving = signal(false);

  save(id: string, changes: FacilityUpdate): Observable<Facility> {
    this.saving.set(true);
    return this.repository.update(id, changes).pipe(
      tap({
        next: () => this.notifications.success(SAVED_MESSAGE),
        error: (error: unknown) =>
          this.notifications.error(`${NOT_SAVED_PREFIX} ${toFacilityErrorMessage(error)}`),
      }),
      finalize(() => this.saving.set(false)),
    );
  }
}
