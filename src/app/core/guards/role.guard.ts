import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const currentUser = auth.currentUserValue;

  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles && allowedRoles.includes(currentUser.role)) {
    return true;
  }

  // Role not authorized
  router.navigate(['/not-authorized']);
  return false;
};
