import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';  

import { hotListResponse, inviteResponse, invitersResponseById, visitorList } from './invites.model';
import { locationResponse, visitorResponse } from '../visitors/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private API_USERS_URL = `${environment.apiUrl}/Invite`;
  private API_VISITOR =`${environment.apiUrl}/Visitor`

  constructor(private http: HttpClient) {}

  visitorList(): Observable<visitorResponse> {
    const url = `${this.API_VISITOR}/GetVisitorsList`;
    return this.http.get<visitorResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  GetVisitorsListForInvite(): Observable<visitorResponse> {
    const url = `${this.API_USERS_URL}/GetVisitorsListForInvite`;
    return this.http.get<visitorResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }

  GetInvitorDetails(): Observable<inviteResponse> {
    const url =  `${this.API_USERS_URL}/GetInviteDetails`;
    return this.http.get<inviteResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<inviteResponse>;
  }

  
  GetVisitorType(): Observable<inviteResponse> {
    const url =  `${this.API_USERS_URL}/GetVisitorType`;
    return this.http.get<inviteResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<inviteResponse>;
  }
  GetVisitorSubType(id :number): Observable<inviteResponse> {
    const url =  `${this.API_USERS_URL}/GetVisitorSubType?Id=${id}`;
    return this.http.get<inviteResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<inviteResponse>;
  }

  GetInviteDetailsById(id: number): Observable<invitersResponseById> {
    const url = `${this.API_USERS_URL}/GetInviteDetailsByInviteId?InviteId=${id}`;
    return this.http.get<invitersResponseById>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<invitersResponseById>;
  }

  GetVisitorDetailsById(id?: number): Observable<visitorResponse> {
    const url = `${this.API_VISITOR}/GetVisitorDetailsByVisitorId?VisitorId=${id}`;
    return this.http.get<visitorResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  AddInviteDetail(data: any): Observable<inviteResponse> {
    const url = `${this.API_USERS_URL}/AddUpdateInviteDetail`;
    return this.http.post<inviteResponse>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<inviteResponse>;
  }

  getHostList(): Observable<hotListResponse> {
    const url = `${this.API_USERS_URL}/GetHostList`;
    return this.http.get<hotListResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<hotListResponse>;
  }

  AddVisitorDetailsByGetKeeper(data: any): Observable<any> {
    const url = `${this.API_USERS_URL}/AddVisitorDetailsByGetKeeper`;
    return this.http.post<any>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  AddVisitOfPreRegisteredVisitorByGetKeeper(data: any): Observable<any> {
    const url = `${this.API_USERS_URL}/AddVisitOfPreRegisteredVisitorByGetKeeper`;
    return this.http.post<any>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
