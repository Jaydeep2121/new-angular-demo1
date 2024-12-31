import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, throwError } from 'rxjs';
import { MultipleResponse, MultipleRes } from './multiple-invites.module';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MultipleInvitesService {
  private API_INVITE_URL = `${environment.apiUrl}/Invite`;
  constructor(private http: HttpClient) { }

  GetGroupInviteListByGroupId(id:number): Observable<MultipleRes> {
    const url =  `${this.API_INVITE_URL}/GetGroupInviteListByGroupId?GroupId=${id}`;
    return this.http.get<MultipleRes>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<MultipleRes>;
  }
  public handleError(err: any): any {
    return throwError(err);
  }
}
