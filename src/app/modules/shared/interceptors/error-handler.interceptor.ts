import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from './../services/notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerInterceptor implements HttpInterceptor {
  public err: any;
  private expectingBlob = false;
  private notificationTypes = ['success', 'warning', 'error', 'information'];

  constructor(protected notification: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloneRequest = request.clone();

    this.expectingBlob = request.responseType === 'blob';

    return next.handle(cloneRequest).pipe(
      tap({
        next: (response: HttpEvent<any>) => {},
        error: (error: HttpErrorResponse) => {
          this.processErrorResponse(error);
        },
      })
    );
  }

  processResponse(response: HttpResponse<any>) {
    if (response.body) {
      this.showNotification(response.body);
    }
  }

  //@ts-ignore
  processErrorResponse(response: HttpErrorResponse) {
    console.log(response);
    let errorResponse = {
      code: 500,
      message: response.error || response.message || response,
    };

    // Handle no-json edge cases by status code
    switch (
      response.status
      // case 500:
      //   errorResponse = {
      //     code: 500,
      //     message: 'Erro interno do servidor',
      //   };
      //   break;
    ) {
    }

    if (!errorResponse) {
      errorResponse = {
        code: 0,
        message: `Servidor não está respondendo.`,
      };
    }

    // dont show notification when request header has NoError parameter on it.
    if (errorResponse && errorResponse.message) {
      this.showErrorNotification(errorResponse, response.status);
    }
  }

  protected showErrorNotification(errorResponse: any, status: number) {
    const notification = errorResponse.message;

    if (status === 400) {
      this.notification.warning(notification);
    } else if (status !== 409) {
      // 409 is used for asking user confirmation
      this.notification.error(notification);

      if (status === 401) {
        // setTimeout(() => {
        //   window.location.href = '';
        // }, 3000);
      }
    }
  }

  private showNotification(message: string) {
    this.notification.success(message);
  }
}
