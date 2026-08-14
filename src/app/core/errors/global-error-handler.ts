import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { AppError } from './app.error';

const UNEXPECTED = 'Something went wrong. Reload the page if the problem continues.';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly injector = inject(Injector);

  handleError(error: unknown): void {
    console.error(error);
    this.injector.get(NotificationService).error(this.toMessage(error));
  }

  private toMessage(error: unknown): string {
    return error instanceof AppError ? error.message : UNEXPECTED;
  }
}
