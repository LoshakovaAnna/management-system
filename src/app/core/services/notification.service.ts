import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  duration  = 3000;

  constructor(private snackBar: MatSnackBar) {
  }

  showErrorNotification(msg: string) {
    this.snackBar.open(
      msg,
      undefined,
      {
        duration: this.duration,
        panelClass: ['notify-msg', 'error-msg']
      });
  }
}
