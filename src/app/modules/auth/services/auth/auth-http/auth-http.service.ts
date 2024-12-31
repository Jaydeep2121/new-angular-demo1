import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../../environments/environment';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../../../models/login.model';
import { LOGIN_SUCCESS_RESPONSE, USER_DETAILS_BY_TOKEN, schoolSiteDetailsResponse, schoolSitePayload } from '../../../models/login-response.model';

const API_USERS_URL = `${environment.apiUrl}/Auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // user login
  login(credentialPayload: LOGIN_CREDENTIAL_PAYLOAD): Observable<LOGIN_SUCCESS_RESPONSE> {
    return this.http.post<LOGIN_SUCCESS_RESPONSE>(`${API_USERS_URL}/Login`, credentialPayload).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))) as Observable<LOGIN_SUCCESS_RESPONSE>;
  }

  UserDetailsByToken(token: any): Observable<USER_DETAILS_BY_TOKEN> {
    return this.http.get<USER_DETAILS_BY_TOKEN>(`${API_USERS_URL}/UserDetailsByToken?Refresh_Token=${token.refresh_Token}`);
  }

  GetSchoolSiteDetails(schoolStitePayload: schoolSitePayload): Observable<schoolSiteDetailsResponse> {
    const url = `${API_USERS_URL}/GetSchoolSiteDetails?UserName=${schoolStitePayload.UserName}&Password=${schoolStitePayload.Password}`;
    return this.http.get<schoolSiteDetailsResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<schoolSiteDetailsResponse>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
