import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { IuserSelect } from '../../services/sel.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSelectService {
  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();
  constructor() { }

  changeMessage(message: IuserSelect) {
    this.messageSource.next(message)
  }

  private componentMethodCallSource = new Subject<any>();

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod(message: IuserSelect) {
    this.componentMethodCallSource.next(message);   
    this.changeMessage(message);   
  }
}
