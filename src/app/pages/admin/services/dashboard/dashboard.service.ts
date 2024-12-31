import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { DashboardResponse } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_DASHBOARD_URL = `${environment.apiUrl}/Dashboard`;
  
  constructor(private http: HttpClient) {}

  GetTotalVisitorInSchool(): Observable<DashboardResponse> {
    const url = `${this.API_DASHBOARD_URL}/GetTotalVisitorInSchool`;
    return this.http.get<DashboardResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<DashboardResponse>;
  }

  GetTotalVisitorTillDate(): Observable<DashboardResponse> {
    const url = `${this.API_DASHBOARD_URL}/GetTotalVisitorTillDate`;
    return this.http.get<DashboardResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<DashboardResponse>;
  }

  GetTotalVisitorVisitToday(): Observable<DashboardResponse> {
    const url = `${this.API_DASHBOARD_URL}/GetTotalVisitorVisitToday`;
    return this.http.get<DashboardResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<DashboardResponse>;
  }
  
  public handleError(err: any): any {
    return throwError(err);
  }
}
