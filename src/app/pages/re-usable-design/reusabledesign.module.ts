import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';
import { NotificationBodyComponent } from './notification-body/notification-body/notification-body.component';

@NgModule({
  declarations: [BackButtonComponent,NotificationBodyComponent],
  imports: [
    CommonModule
  ],
  exports:[BackButtonComponent,NotificationBodyComponent]
})
export class ReusabledesignModule { }
