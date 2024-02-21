import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    duration: 5000,
  };
  constructor(private notification: MatSnackBar) {}

  info(notification: string) {
    this.notify({
      message: notification,
      type: { ...this.defaultConfig },
    });
  }
  success(notification: string) {
    this.notify({
      message: notification,
      type: { ...this.defaultConfig },
    });
  }
  warning(notification: string) {
    this.notify({
      message: notification,
      type: { ...this.defaultConfig },
    });
  }
  error(notification: string) {
    this.notify({
      message: notification,
      type: { ...this.defaultConfig },
    });
  }

  private notify(notification: { message: string; type: MatSnackBarConfig }) {
    this.notification.open(notification.message, undefined, notification.type);
  }
}
