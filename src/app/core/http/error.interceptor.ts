import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '../errors/app.error';

const NETWORK_UNREACHABLE = 'The server could not be reached. Check your connection.';
const UNEXPECTED = 'The request could not be completed.';

const MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'The request was rejected. Check the values and try again.',
  401: 'This session is no longer signed in. Sign in again to continue.',
  403: 'This account cannot perform that action.',
  404: 'That record no longer exists.',
  409: 'Someone else changed this record. Reload it and reapply the change.',
  422: 'Some values were not accepted. Correct them and try again.',
};

const SERVER_ERROR_THRESHOLD = 500;
const SERVER_ERROR = 'The server failed to handle the request. Try again shortly.';

function toMessage(response: HttpErrorResponse): string {
  if (response.status === 0) {
    return NETWORK_UNREACHABLE;
  }
  if (response.status >= SERVER_ERROR_THRESHOLD) {
    return SERVER_ERROR;
  }
  return MESSAGE_BY_STATUS[response.status] ?? UNEXPECTED;
}

export const errorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        return throwError(() => new AppError(toMessage(error), error.status, error));
      }
      return throwError(() => error);
    }),
  );
