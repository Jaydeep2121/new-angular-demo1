import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor() { }
  private pageTitleSubject = new BehaviorSubject<string>('Dashboard');
  pageTitle$ = this.pageTitleSubject.asObservable();

  setTitle(title: string) {
    this.pageTitleSubject.next(title);
  }
}
