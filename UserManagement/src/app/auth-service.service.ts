import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl = 'http://localhost:8080/api/auth';
  constructor(private http: HttpClient,private router: Router , @Inject(PLATFORM_ID) private platformId: Object) { }

    // Generate Token method (same as login, but explicitly handles token)
    generateToken(credentials: any): Observable<any>
    {
      console.log("Inside generateToken, sending request to backend...", credentials);

      return this.http.post(`${this.baseUrl}/login`, credentials);
    }

      // Save token to localStorage
      saveTokens(token: string, refreshToken: string): void 
      {
        if (isPlatformBrowser(this.platformId) && token) {
          console.log('Saving tokens:',{ token, refreshToken}); // Debugging
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
      // Get token from localStorage
    getToken(): string | null {
      if (isPlatformBrowser(this.platformId))
         {
            return localStorage.getItem('authToken');
         }
        return null;
      }

      getRefreshToken(): string | null {
        return isPlatformBrowser(this.platformId) ? localStorage.getItem('refreshToken') : null;
      }

      refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        console.log('Attempting refresh with token:', refreshToken);
        return this.http.post(`${this.baseUrl}/refresh`, {refreshToken});

      }

      
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      console.warn("No token found in localStorage!");
      return new HttpHeaders();  // Return empty headers instead of sending "null"
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

   // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; // If no token, consider it expired

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const expiry = tokenPayload.exp * 1000 ; // Convert to milliseconds
      return Date.now() > expiry; // Check if current time is past expiry
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat any error as an expired token
    }
  }
    // Remove token (logout)
    logout(): void {
      if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      this.router.navigate(['/login']);
    }
  }
}

