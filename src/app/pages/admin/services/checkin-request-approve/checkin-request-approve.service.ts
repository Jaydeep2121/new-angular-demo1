import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs'; 
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CheckinRequestApproveService {
  private API_VISITOR =`${environment.apiUrl}/Visitor`
  constructor(private http: HttpClient) { }
  GetUnplannedVistListAdminSide(): Observable<any> {
    const url = `${this.API_VISITOR}/GetUnplannedVistListAdminSide`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }
  UpdatedNotificationStatusOfAdmin(id:any,status:boolean): Observable<any> {
    const url = `${this.API_VISITOR}/UpdatedNotificationStatusOfAdmin?InviteId=${id}&Status=${status}`;
    return this.http.post<any>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }
  public handleError(err: any): any {
    return throwError(err);
  }
}
