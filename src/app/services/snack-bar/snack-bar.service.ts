import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private snackBar: MatSnackBar) { }

  success(message: string, action: string, duration?: number, horPos?: MatSnackBarHorizontalPosition, vertPos?: MatSnackBarVerticalPosition){
    return this.snackBar.open(message, action, {
      horizontalPosition: horPos ? horPos : this.horizontalPosition,
      verticalPosition: vertPos ? vertPos : this.verticalPosition,
      duration: duration ? duration : 10000,
      panelClass: ['snackbarSuccess']
    });
  }

  info(message: string, action: string, duration?: number, horPos?: MatSnackBarHorizontalPosition, vertPos?: MatSnackBarVerticalPosition){
    return this.snackBar.open(message, action, {
      horizontalPosition: horPos ? horPos : this.horizontalPosition,
      verticalPosition: vertPos ? vertPos : this.verticalPosition,
      duration: duration ? duration : 10000,
      panelClass: ['snackbarInfo']
    });
  }

  error(message: string, action: string, duration?: number, horPos?: MatSnackBarHorizontalPosition, vertPos?: MatSnackBarVerticalPosition){
    return this.snackBar.open(message, action, {
      horizontalPosition: horPos ? horPos : this.horizontalPosition,
      verticalPosition: vertPos ? vertPos : this.verticalPosition,
      duration: duration ? duration : 10000,
      panelClass: ['snackbarError'],
    });
  }
}
