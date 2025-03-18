
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    const token = this.authService.getToken();

    // If no token is found, redirect to login
    if (!token) {
      console.log('AuthGuard: No token found. Redirecting to login...');
      this.router.navigate(['/']);
      return false;
    }

    // If token is expired, try to refresh
    if (this.authService.isTokenExpired(token)) {
      console.log(' AuthGuard: Token expired. Attempting to refresh...');

      return this.authService.updateRefreshToken().pipe(
        map(() => {
          console.log('AuthGuard: Token refreshed. Access granted.');
          return true;
        }),
        catchError(() => {
          // If refresh token fails, log out and redirect to login page
          console.log('AuthGuard: Token refresh failed. Redirecting to login...');
          this.authService.logout();
          // Adding a slight delay to avoid immediate routing conflict
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0); 
          return of(false); // Ensure Observable<boolean> is returned
        })
      );
    }

    // If token is valid, grant access
    console.log(' AuthGuard: Token valid. Access granted.');
    return true;
  }
}
