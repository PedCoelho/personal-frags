import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/modules/shared/services/auth.service';
import { Observable, map } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedIn$.pipe(
    map((loggedIn) => {
      if (loggedIn) {
        return true;
      } else {
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};

export const loginGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedIn$.pipe(
    map((loggedIn) => {
      console.log('login guard', loggedIn);

      if (loggedIn) {
        router.navigateByUrl('/');
        return false;
      } else return true;
    })
  );
};
