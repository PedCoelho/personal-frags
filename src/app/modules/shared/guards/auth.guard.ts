import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/modules/login/services/auth.service';

export const authGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  //   const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  //   authFacade.logout();
  router.navigateByUrl('/login');
  return false;
};
