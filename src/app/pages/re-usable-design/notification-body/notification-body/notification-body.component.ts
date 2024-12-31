import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-body',
  templateUrl: './notification-body.component.html',
  styleUrl: './notification-body.component.scss'
})
export class NotificationBodyComponent {
  @Input() notificationMsg: string = '';
  @Output() onCancelClick:EventEmitter<boolean> = new EventEmitter();
  @Output() onOKClick:EventEmitter<boolean> = new EventEmitter();

  onOkOrCancel(actionBtn:string){
    if (actionBtn==='ok') {
      this.onOKClick.emit(true);
    }else if(actionBtn==='cancle'){
      this.onCancelClick.emit(true);
    }
  }

}
