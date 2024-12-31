import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuUserAccessService {
  private messageSource = new BehaviorSubject(true);
  currentMessage = this.messageSource.asObservable();
  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

  private componentMethodCallSource = new Subject<boolean>();

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod(message: boolean) {
    this.componentMethodCallSource.next(message);   
    this.changeMessage(message);   
  }
}
