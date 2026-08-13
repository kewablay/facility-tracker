import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockSessionService } from '../auth/mock-session.service';
import { mockAuthGuard } from './mock-auth.guard';

function runGuard(): boolean | unknown {
  return TestBed.runInInjectionContext(() =>
    mockAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('mockAuthGuard', () => {
  it('lets the route activate while the mock session is signed in', () => {
    TestBed.configureTestingModule({});

    expect(runGuard()).toBe(true);
  });

  it('blocks the route when the session says it is not signed in', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: MockSessionService, useValue: { isSignedIn: () => false } }],
    });

    expect(runGuard()).toBe(false);
  });
});
