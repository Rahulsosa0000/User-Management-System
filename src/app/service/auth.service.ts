
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Backend API Base URL

  constructor(private http: HttpClient,private router:Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      map((response: any) => {
        console.log('Full Login Response:', response);
  
        if (response.accessToken && response.refreshToken) {
          return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType,
            id: response.id,
            username: response.username
          };
        } else {
          throw new Error('Invalid login response format');
        }
      })
    );
  }
  
  
  

  //  Store Tokens Securely
  storeTokens(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken) {
      console.error("Cannot store tokens. Missing values!", { accessToken, refreshToken });
      return;
    }
    console.log(' Storing Tokens:', { accessToken, refreshToken });
    localStorage.setItem('JWT', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  //  Get Access Token
  getToken(): string | null {
    return localStorage.getItem('JWT');
  }

  //  Get Refresh Token
  getRefreshToken(): string | null {
    const token = localStorage.getItem('refreshToken');
    console.log("🔄 Retrieved refresh token:", token);
    return token;
  }

  //  Refresh Access Token
  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token found');
      this.logout();  // Ensure logout is called here
      return throwError(() => new Error('No refresh token found'));
    }
  
    return this.http.post(`${this.baseUrl}/refreshtoken`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('tokenType', response.tokenType); 
          localStorage.setItem('userId', response.id.toString()); 
          localStorage.setItem('username', response.username); 
        } else {
          console.error('Invalid refresh API response:', response);
          throw new Error('Invalid refresh API response format');
        }
      }),
      catchError((error) => {
        console.error(' Refresh token failed', error);
        this.logout();  // Make sure to log out on error
        return throwError(() => error);
      })
    );
  }
  
  
  


  updateRefreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error(" No refresh token available.");
      this.logoutAndRedirect();
      return throwError(() => new Error("No refresh token available"));
    }
  
    console.log(" AuthService: Refreshing token...");
  
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/refreshtoken`, { refreshToken }
    ).pipe(
      tap(response => {
        console.log(" AuthService: New token received:", response);
        if (response.accessToken && response.refreshToken) {
          this.storeTokens(response.accessToken, response.refreshToken);
        } else {
          console.error(" Invalid token response from server!", response);
          this.logoutAndRedirect();
        }
      }),
      catchError(error => {
        console.error(" Refresh token failed!", error);
        this.logoutAndRedirect(); // Logout user if refresh token fails
        return throwError(() => error);
      })
    );
  }
 logoutAndRedirect(): void {
  console.log('Logging Out...');
  this.logout();  // Clear tokens
  console.log('Tokens cleared.');
  setTimeout(() => {
    console.log('Redirecting to login...');
    this.router.navigate(['/']);
  }, 0);  // Delay the redirection slightly
}

  
  //  Check Authentication
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  //  Decode JWT Token
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode payload
    } catch (e) {
      console.error(' Error decoding token', e);
      return null;
    }
  }

  //  Check if Token is Expired
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true; // Invalid token
      }
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return expiry < Date.now();  // Check if token is expired
    } catch (e) {
      console.error(' Error checking token expiration', e);
      return true;
    }
  }

  //  Logout
  logout(): void {
    console.log(' Logging Out & Clearing Tokens');
    localStorage.removeItem('JWT');
    localStorage.removeItem('refreshToken');  
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // Redirecting to login page after clearing localStorage
    this.router.navigate(['/']);
  }
}
