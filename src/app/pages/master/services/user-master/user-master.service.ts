import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SchoolSiteResponse, UserMasterRequest, UserMasterResponse } from './user-master.model';

@Injectable({
  providedIn: 'root',
})
export class UserMasterService {
  private API_ADMIN_URL = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  GetSchoolSiteList(): Observable<SchoolSiteResponse> {
    const url = `${this.API_ADMIN_URL}/GetSchoolSiteList`;
    return this.http.get<SchoolSiteResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<SchoolSiteResponse>;
  }

  AddUserMaster(data: UserMasterRequest): Observable<any> {
    const url = `${this.API_ADMIN_URL}/SaveAdminUserDetails`;
    return this.http.post<any>(url, data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  GetUserMasterList(): Observable<UserMasterResponse> {
    const url = `${this.API_ADMIN_URL}/GetAdminUserList`;
    return this.http.get<UserMasterResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<UserMasterResponse>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
