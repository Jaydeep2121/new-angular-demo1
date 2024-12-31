import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Iyear } from '../../services/sel.interface';

@Injectable({
  providedIn: 'root'
})
export class YearSelectService {
  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();
  constructor() { }

  changeMessage(message: Iyear) {
    this.messageSource.next(message)
  }

  private componentMethodCallSource = new Subject<any>();

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod(message: Iyear) {
    this.componentMethodCallSource.next(message);   
    this.changeMessage(message);   
  }
}
