import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { GroupsResponse, GroupsResponsenew } from './groups.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private API_INVITE_URL = `${environment.apiUrl}/Invite`;
  private API_VISITER_URL = `${environment.apiUrl}/Visitor`;
  constructor(private http: HttpClient) { }

  GetGroupList(): Observable<GroupsResponse> {
    const url =  `${this.API_INVITE_URL}/GetGroupList`;
    return this.http.get<GroupsResponse>(url).pipe( 
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<GroupsResponse>;
  }
  GetVisitDetails(FromDat:any,ToDate:any): Observable<any> { 
    const url =  `${this.API_VISITER_URL}/GetVisitDetails?FromDate=${FromDat}&ToDate=${ToDate}`;
    return this.http.get<GroupsResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<GroupsResponse>;
  }
  
  AddGroupInviteDetail(data: any): Observable<GroupsResponse> {
    const url = `${this.API_INVITE_URL}/AddGroupInviteDetail`;
    return this.http.post<GroupsResponse>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<GroupsResponse>;
  }


  CreateGroup(data: any): Observable<GroupsResponsenew> {
    const url = `${this.API_INVITE_URL}/CreateGroupWithVisitor`;
    return this.http.post<GroupsResponsenew>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<GroupsResponsenew>;
  }
  public handleError(err: any): any {
    return throwError(err);
  }
}
