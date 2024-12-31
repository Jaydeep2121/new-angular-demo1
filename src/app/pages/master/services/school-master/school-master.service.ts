import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolMasterService {

  private API_UPLOAD = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  GetSchoolMasterList(): Observable<any> {
    const url =  `${this.API_UPLOAD}/Admin/GetSchoolMasterList`;
    return this.http.get<any>(url).pipe( 
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  SaveSchoolDetails(data: any): Observable<any> {
    const url = `${this.API_UPLOAD}/Admin/SaveSchoolDetails`;
    return this.http.post<any>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
