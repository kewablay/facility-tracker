import {
  Component,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { FacilityFormGroup } from '../models/facility-form.model';
import { Facility } from '../models/facility.model';
import { FacilityForm } from '../ui/facility-form/facility-form';
import { createFacilityForm } from '../utils/create-facility-form';
import { FacilityEditStore } from './facility-edit.store';

const DIALOG_WIDTH = { width: '560px' };
const NARROW_SCREEN_WIDTH = { '640px': '94vw' };

@Component({
  selector: 'app-facility-edit-dialog',
  providers: [FacilityEditStore],
  imports: [DialogModule, FacilityForm],
  templateUrl: './facility-edit-dialog.html',
})
export class FacilityEditDialog {
  readonly facility = input.required<Facility>();

  readonly saved = output<void>();
  readonly closed = output<void>();

  protected readonly editStore = inject(FacilityEditStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formComponent = viewChild(FacilityForm);

  protected readonly dialogWidth = DIALOG_WIDTH;
  protected readonly narrowScreenWidth = NARROW_SCREEN_WIDTH;
  protected readonly visible = signal(true);
  protected readonly submitted = signal(false);

  protected readonly form = linkedSignal<Facility, FacilityFormGroup>({
    source: this.facility,
    computation: (facility) => createFacilityForm(facility),
  });

  protected onSave(): void {
    if (this.editStore.saving()) {
      return;
    }
    const form = this.form();

    this.submitted.set(true);
    if (form.invalid) {
      form.markAllAsTouched();
      this.formComponent()?.focusFirstInvalidField();
      return;
    }

    form.disable();
    this.editStore
      .save(this.facility().id, form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.visible.set(false);
          this.saved.emit();
        },
        error: () => form.enable(),
      });
  }
}
