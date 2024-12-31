import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisitorCheckInCheckOutService {
  private API_UPLOAD = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  imageUpload(formData): Observable<any> {
    const url = `${this.API_UPLOAD}/Image/UploadImage`;
    return this.http.post<any>(url,formData).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
