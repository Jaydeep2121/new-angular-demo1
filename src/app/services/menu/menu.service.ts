import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { ImenuList } from '../../services/sel.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();
  constructor() { }

  changeMessage(message: ImenuList[] | string) {
    this.messageSource.next(message)
  }

  private componentMethodCallSource = new Subject<ImenuList[] | string>();

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod(message: ImenuList[] | string) {
    this.componentMethodCallSource.next(message);   
    this.changeMessage(message);   
  }
}
