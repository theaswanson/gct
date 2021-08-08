import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  dismiss() {
    this.snackBar.dismiss();
  }

  open(message: string) {
    this.snackBar.open(message, 'OK', {duration: 5 * 1000});
  }
}
