import { Component, ElementRef, input, output, viewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FACILITY_FORM_FIELDS,
  FacilityFormField,
  FacilityFormGroup,
} from '../../models/facility-form.model';
import { FACILITY_STATUS_LABEL, FACILITY_STATUS_VALUES } from '../../models/facility-status.model';
import { FACILITY_TYPE_LABEL, FACILITY_TYPE_VALUES } from '../../models/facility-type.model';
import { toFieldErrorMessage } from '../../utils/facility-form-messages';

@Component({
  selector: 'app-facility-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './facility-form.html',
  styleUrl: './facility-form.scss',
})
export class FacilityForm {
  readonly form = input.required<FacilityFormGroup>();
  readonly saving = input(false);
  readonly submitted = input(false);

  readonly save = output<void>();
  readonly cancelled = output<void>();

  private readonly fields = viewChildren<ElementRef<HTMLElement>>('field');

  protected readonly typeOptions = FACILITY_TYPE_VALUES;
  protected readonly statusOptions = FACILITY_STATUS_VALUES;
  protected readonly typeLabel = FACILITY_TYPE_LABEL;
  protected readonly statusLabel = FACILITY_STATUS_LABEL;

  protected showsError(field: FacilityFormField): boolean {
    const control = this.form().controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorId(field: FacilityFormField): string {
    return `facility-${field}-error`;
  }

  protected errorMessage(field: FacilityFormField): string {
    return toFieldErrorMessage(field, this.form().controls[field].errors);
  }

  focusFirstInvalidField(): void {
    const field = FACILITY_FORM_FIELDS.find((name) => this.form().controls[name].invalid);
    const wrapper = this.fields().find((item) => item.nativeElement.dataset['field'] === field);
    wrapper?.nativeElement.querySelector<HTMLElement>('input, select')?.focus();
  }
}
