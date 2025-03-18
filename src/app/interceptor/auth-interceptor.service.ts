
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router'; // Import Router for redirection

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.authService.getToken();

    // Attach JWT Token to every request
    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Unauthorized: Try Refreshing Token
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        // Call the refresh token API to get a new token
        return this.authService.refreshAccessToken().pipe(
            switchMap((response: any) => {
                this.isRefreshing = false;

                // If the refresh was successful, store the new tokens
                if (response.accessToken && response.refreshToken) {
                    this.authService.storeTokens(response.accessToken, response.refreshToken);
                    this.refreshTokenSubject.next(response.accessToken);

                    // Retry the failed request with the new token
                    return next.handle(this.addToken(request, response.accessToken));
                } else {
                    // If refresh token expired or invalid, logout and redirect
                    this.authService.logout();
                    this.router.navigate(['/']); // Redirect to login page
                    return throwError(() => new Error('Unable to refresh token'));
                }
            }),
            catchError((err) => {
                this.isRefreshing = false;
                this.authService.logout(); // Logout on error
                this.router.navigate(['/']); // Redirect to login page
                return throwError(() => err);
            })
        );
    } else {
        // If token refresh is in progress, wait for the new token
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => next.handle(this.addToken(request, token!)))
        );
    }
}


  // Add the token to request headers
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
