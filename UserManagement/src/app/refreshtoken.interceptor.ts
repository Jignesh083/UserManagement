import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); 

  constructor(private authService: AuthServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("In interceptor");
    const token = this.authService.getToken();

    let clonedRequest = req;
    if (token) {
      clonedRequest = this.addTokenHeader(req, token);
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/refresh')) {
          console.warn('Access token expired. Attempting to refresh token...');

          return this.handle401Error(clonedRequest, next); 
        }

        return throwError(() => error);
      })
    );
  }

  // HANDLES REFRESH LOGIC FOR MULTIPLE PARALLEL REQUESTS
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // RESET THE SUBJECT

      return this.authService.refreshToken().pipe(
        switchMap((newToken: any) => {
          this.isRefreshing = false;

          this.authService.saveTokens(newToken.token, newToken.refreshToken);
          this.refreshTokenSubject.next(newToken.token); // BROADCAST NEW TOKEN TO WAITING REQUESTS

          return next.handle(this.addTokenHeader(request, newToken.token));
        }),
        catchError((refreshError) => {
          this.isRefreshing = false;
          console.error('Refresh token failed:', refreshError);
          this.authService.logout();
          return throwError(() => refreshError);
        })
      );
    } 
    else 
    {
      //  WAIT FOR REFRESH TO COMPLETE & USE THE NEW TOKEN
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
