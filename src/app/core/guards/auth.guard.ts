import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((res) => {
      if (res) {
        console.log('User is authenticated');
        return true;
      } else {
        console.log('User is not authenticated');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
