import { Injectable } from '@angular/core';
import { getSiteMasterResponse, saveSchoolSitePayload, saveSchoolSiteResponse, siteMaster } from './site-master-model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SiteMasterService {
  private API_USERS_URL = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  GetSchoolList(): Observable<siteMaster> {
    const url =  `${this.API_USERS_URL}/GetSchoolList`;
    return this.http.get<siteMaster>(url).pipe(
      map((res:siteMaster) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<siteMaster>;
  }

  SaveSchoolSiteDetails(data: saveSchoolSitePayload): Observable<saveSchoolSiteResponse> {
    const url = `${this.API_USERS_URL}/SaveSchoolSiteDetails`;
    return this.http.post<saveSchoolSiteResponse>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<saveSchoolSiteResponse>;
  }

  GetSiteMasterList(): Observable<getSiteMasterResponse> {
    const url =  `${this.API_USERS_URL}/GetSiteMasterList`;
    return this.http.get<getSiteMasterResponse>(url).pipe(
      map((res:getSiteMasterResponse) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<getSiteMasterResponse>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
