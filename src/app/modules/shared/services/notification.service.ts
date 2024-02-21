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
      message: `${notification}`,
      type: { ...this.defaultConfig, panelClass: 'info' },
    });
  }
  success(notification: string) {
    this.notify({
      message: `${notification}`,
      type: { ...this.defaultConfig, panelClass: 'success' },
    });
  }
  warning(notification: string) {
    this.notify({
      message: `${notification}`,
      type: { ...this.defaultConfig, panelClass: 'warn' },
    });
  }
  error(notification: string) {
    this.notify({
      message: `${notification}`,
      type: { ...this.defaultConfig, panelClass: 'error', duration: 0 },
      action: 'Fechar',
    });
  }

  private notify(notification: {
    message: string;
    type: MatSnackBarConfig;
    action?: string;
  }) {
    this.notification.open(
      notification.message,
      notification.action,
      notification.type
    );
  }
}
