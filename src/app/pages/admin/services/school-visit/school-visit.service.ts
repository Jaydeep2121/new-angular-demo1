import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolVisitService {
  private API_DASHBOARD_URL = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) { }

  GetSchoolDetails(): Observable<any> {
    const url =  `${this.API_DASHBOARD_URL}/GetSchoolDetails`;
    return this.http.get<any>(url).pipe(
      map((res:any) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }
  UpdateSchoolDetails(id:any,SMS: any,isApproval: any,Whatsapp:any): Observable<any> {
    const url = `${this.API_DASHBOARD_URL}/UpdateSchoolDetails?id=${id}&SMS=${SMS}&isApproval=${isApproval}&Whatsapp=${Whatsapp}`;
    return this.http.post<any>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
