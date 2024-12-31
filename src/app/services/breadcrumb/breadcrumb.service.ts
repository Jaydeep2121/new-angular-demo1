import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Ibreadcrumb } from '../../services/sel.interface';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();
  constructor() { }

  changeMessage(message: Ibreadcrumb[]) {
    this.messageSource.next(message)
  }

  private componentMethodCallSource = new Subject<any>();

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod(message: Ibreadcrumb[]) {
    this.componentMethodCallSource.next(message);   
    this.changeMessage(message);   
  }
}
