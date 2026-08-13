import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-value',
  templateUrl: './data-value.html',
  styleUrl: './data-value.scss',
})
export class DataValue {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly mono = input(false);
}
