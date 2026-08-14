import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AppError } from '../errors/app.error';
import { errorInterceptor } from './error.interceptor';

const URL = '/api/facilities';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  async function failWith(status: number): Promise<AppError> {
    const response = firstValueFrom(http.get(URL));
    backend.expectOne(URL).flush('', { status, statusText: 'Failed' });
    return response.then(
      () => {
        throw new Error('The request should not have succeeded');
      },
      (error: unknown) => error as AppError,
    );
  }

  it('translates a status into copy that says what to do next', async () => {
    const error = await failWith(404);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('That record no longer exists.');
    expect(error.status).toBe(404);
  });

  it('treats every server failure the same way', async () => {
    expect((await failWith(500)).message).toBe(
      'The server failed to handle the request. Try again shortly.',
    );
    expect((await failWith(503)).message).toBe(
      'The server failed to handle the request. Try again shortly.',
    );
  });

  it('names an unreachable server rather than reporting a status of zero', async () => {
    expect((await failWith(0)).message).toBe(
      'The server could not be reached. Check your connection.',
    );
  });

  it('falls back to a general message for a status it has no wording for', async () => {
    expect((await failWith(418)).message).toBe('The request could not be completed.');
  });

  it('keeps the original response, so nothing is lost in translation', async () => {
    const error = await failWith(409);

    expect(error.cause).toBeInstanceOf(HttpErrorResponse);
  });

  it('leaves a successful response untouched', async () => {
    const response = firstValueFrom(http.get<{ ok: boolean }>(URL));
    backend.expectOne(URL).flush({ ok: true });

    expect(await response).toEqual({ ok: true });
  });
});
