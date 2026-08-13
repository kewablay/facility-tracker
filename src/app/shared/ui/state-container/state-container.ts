import { Component, input } from '@angular/core';
import { RequestState } from '@shared/models/request-state.model';

@Component({
  selector: 'app-state-container',
  templateUrl: './state-container.html',
})
export class StateContainer {
  readonly state = input.required<RequestState<unknown>>();
  readonly isEmpty = input(false);
}
