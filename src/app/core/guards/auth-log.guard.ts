import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { inject } from '@angular/core';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthService);
  const router = inject(Router);

  return authServices.isAuthenticated().pipe(
    map(res => {
      if (res) {
        router.navigate(['/home']);
        return false; 
      } else {
        return true;
      }
    })
  );
};
