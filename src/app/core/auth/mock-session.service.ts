import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockSessionService {
  private readonly signedIn = signal(true);

  isSignedIn(): boolean {
    return this.signedIn();
  }
}
