import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
  };
  constructor(private notification: MatSnackBar) {}

  success(notification: { message: string }) {
    this.notify({
      message: notification.message,
      type: { ...this.defaultConfig },
    });
  }
  warning(notification: { message: string }) {
    this.notify({
      message: notification.message,
      type: { ...this.defaultConfig },
    });
  }
  error(notification: { message: string }) {
    this.notify({
      message: notification.message,
      type: { ...this.defaultConfig },
    });
  }

  private notify(notification: { message: string; type: MatSnackBarConfig }) {
    this.notification.open(notification.message, undefined, notification.type);
  }
}
