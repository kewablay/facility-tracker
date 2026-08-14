import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MockSessionService } from '../auth/mock-session.service';

export const mockAuthGuard: CanActivateFn = () => inject(MockSessionService).isSignedIn();
