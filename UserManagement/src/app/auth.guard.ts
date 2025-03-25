import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);
  const token = authService.getToken();
  const isExpired = authService.isTokenExpired();

  
  console.log('Auth Guard Check - Token:', token, 'Expired:', isExpired); // Debugging

  if (token) {
    return true;
  }

  console.warn('Auth Guard Failed - Redirecting to login');
  router.navigate(['/login']);
  return false;

};
