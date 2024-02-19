import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerInterceptor implements HttpInterceptor {
  public err: any;

  private notificationTypes = ['success', 'warning', 'error', 'information'];

  constructor(
    protected notification: NotificationService,
    protected dialog: DialogService,
    private literalsService: DocHttpLiteralsService,
    @Inject(DocHttpEnableTranslocoToken)
    private docHttpEnableTranslocoToken: boolean
  ) {
    this.literalsService
      .getLiterals()
      .subscribe((literals: DocHttpLiterals) => {
        this.literals = literals;
      });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloneRequest = request.clone({
      setHeaders: {
        'X-Totvs-No-Error': 'true',
        'X-PO-No-Message': 'true',
      },
    });

    this.expectingBlob = request.responseType === 'blob';

    return next.handle(cloneRequest).pipe(
      tap({
        next: (response: HttpEvent<any>) => {
          if (response instanceof HttpResponse) {
            this.processResponse(response);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.processErrorResponse(error);
        },
      })
    );
  }

  processResponse(response: HttpResponse<any>) {
    if (response.body && response.body.totvsMessages) {
      const totvsMessages = response.body.totvsMessages;

      if (totvsMessages instanceof Array) {
        totvsMessages.forEach((totvsMessage: any) => {
          this.showNotification(totvsMessage);
        });
      } else {
        this.showNotification(totvsMessages);
      }
    }
  }

  processErrorResponse(response: HttpErrorResponse) {
    let errorResponse;

    // Handle no-json edge cases by status code
    if (response.headers.get('content-type') !== 'application/json') {
      switch (response.status) {
        case 500:
          errorResponse = {
            code: 500,
            message: this.literals.internalServerErrorMessage,
          };
          break;
      }
    }

    if (response.status !== 0 && response.error) {
      try {
        const error =
          response.error instanceof ArrayBuffer
            ? String.fromCharCode.apply(null, new Uint8Array(response.error))
            : response.error;

        errorResponse = this.sanitizeError(
          typeof error === 'string' ? JSON.parse(error) : error
        );
      } catch {
        errorResponse = null;
      }
    }

    if (this.expectingBlob) {
      return this.handleBlobErrorResponse(response);
    }

    if (!errorResponse) {
      errorResponse = {
        code: 0,
        message: this.literals.serverNotRespondingMessage,
        detailedMessage: response.message,
      };
    }

    // dont show notification when request header has NoError parameter on it.
    if (errorResponse && errorResponse.message) {
      this.showErrorNotification(errorResponse, response.status);
    }
  }

  protected showErrorNotification(errorResponse: any, status: number) {
    const notificationAction =
      this.generateErrorNotificationAction(errorResponse);
    const message =
      errorResponse && errorResponse.details && errorResponse.details.length > 0
        ? errorResponse.details[0].message
        : errorResponse.message;
    const notification: DocNotification = {
      message: message,
      actionLabel: notificationAction.label,
    };

    if (status === 400) {
      this.notification.warning(notification);
    } else if (status !== 409) {
      // 409 is used for asking user confirmation
      this.notification.error(notification);

      if (status === 401) {
        setTimeout(() => {
          window.location.href = '';
        }, 3000);
      }
    }
  }

  private showNotification(totvsMessage: any) {
    if (this.notificationTypes.includes(totvsMessage.type)) {
      this.notification[totvsMessage.type]({
        message: totvsMessage.detail,
      });
    }
  }

  private generateUrlHelpFunction(helpUrl: string) {
    return () => {
      window.open(helpUrl, '_blank');
    };
  }

  private async handleBlobErrorResponse(
    response: HttpErrorResponse
  ): Promise<void> {
    const defaultResponse = {
      code: 0,
      message: this.literals.expectingBlobMessage,
    };

    try {
      from(response.error.text())
        .pipe(
          first(),
          map((text: string) => {
            return this.sanitizeError(JSON.parse(text));
          }),
          catchError(() => of(defaultResponse))
        )
        .subscribe((errorResponse: any) => {
          this.showErrorNotification(errorResponse, response.status);
        });
    } catch {
      this.showErrorNotification(defaultResponse, response.status);
    }
  }
}
