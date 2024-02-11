import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private readonly STORAGE_KEY = 'token';
  private readonly STORAGE_PREFIX = 'personal-frags';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 403) {
              this.clearToken();
              return err;
            }
          }
        }
      )
    );
  }

  private getToken() {
    return localStorage.getItem(`${this.STORAGE_PREFIX}.${this.STORAGE_KEY}`);
  }

  private clearToken() {
    return localStorage.removeItem(
      `${this.STORAGE_PREFIX}.${this.STORAGE_KEY}`
    );
  }
}
