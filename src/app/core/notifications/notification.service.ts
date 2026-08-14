import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

const TOAST_LIFE_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);

  success(message: string): void {
    this.messages.add({ severity: 'success', summary: message, life: TOAST_LIFE_MS });
  }

  error(message: string): void {
    this.messages.add({ severity: 'error', summary: message, life: TOAST_LIFE_MS });
  }
}
