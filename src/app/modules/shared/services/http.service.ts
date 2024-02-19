import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, mergeMap } from 'rxjs';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { ErrorHandlerInterceptor } from '../interceptors/error-handler.interceptor';
import { NotificationService } from './notification.service';
class HttpInterceptorHandler implements HttpHandler {
  constructor(
    private next: HttpHandler,
    private interceptor: HttpInterceptor
  ) {}

  public handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(request, this.next);
  }
}

@Injectable({ providedIn: 'root' })
export class HttpService extends HttpClient {
  private headers: Record<string, string | string[]> = {};
  private interceptors: HttpInterceptor[] = [
    new AuthInterceptor(),
    new ErrorHandlerInterceptor(inject(NotificationService)),
  ];

  constructor(private httpHandler: HttpHandler) {
    super(httpHandler);
  }

  // Override the original method to wire interceptors when triggering the request.
  public override request(method?: any, url?: any, options?: any): any {
    let promise;

    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
      this.httpHandler
    );

    if (options) {
      if (options.headers && options.headers['append']) {
        Object.keys(this.headers).forEach((key) => {
          options.headers = (options.headers as HttpHeaders).append(
            key,
            this.headers[key]
          );
        });
      }

      if (options.headers && !options.headers['append']) {
        options.headers = { ...options.headers, ...this.headers };
      }
    }

    if (!options && Object.keys(this.headers).length) {
      options = { headers: this.headers };
    }

    if (!promise) {
      return new HttpClient(handler).request(method, url, options);
    }

    return from(promise).pipe(
      mergeMap(() => {
        return new HttpClient(handler).request(method, url, options);
      })
    );
  }
}
