import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';  
import { getMultipleInviteResponse, getWatchListResponse, locationResponse, vipStatusResponse, visitorCategoryResponse, visitorResponse, visitorResponseById } from './visitor.model';


@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private API_USERS_URL = `${environment.apiUrl}/Visitor`;
  private API_QR_URL = `${environment.apiUrl}/Invite`;
  private API_USERS_AUTH = `${environment.apiUrl}/Auth`;
  countryList = new BehaviorSubject([]);
  constructor(private http: HttpClient) {}

  visitorStatus(): Observable<vipStatusResponse> {
    const url = `${this.API_USERS_URL}/GetVisitorStatus`;
    return this.http.get<vipStatusResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<vipStatusResponse>;
  }

  getVisitorCountryStateCityList(): Observable<locationResponse> {
    const url = `${this.API_USERS_AUTH}/GetStateCityList`;
    return this.http.get<locationResponse>(url).pipe(
      map((res) =>
      {
        this.countryList.next(res.value);
        return res
      }),
      catchError((err) => this.handleError(err))
    ) as Observable<locationResponse>;
  }

  saveVisitorDetail(data: any): Observable<visitorResponse> {
    const url = `${this.API_USERS_URL}/AddUpdateVisitorDetail`;
    return this.http.post<visitorResponse>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }

  getVisitorDetails(): Observable<visitorResponse> {
    const url =  `${this.API_USERS_URL}/GetVisitorList`;
    return this.http.get<visitorResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  GetVisitorDetailsById(id?: number): Observable<visitorResponseById> {
    const url = `${this.API_USERS_URL}/GetVisitorDetailsByVisitorId?VisitorId=${id}`;
    return this.http.get<visitorResponseById>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponseById>;
  }

  GetUnplannedVistListUserSide(): Observable<any> {
    const url =  `${this.API_USERS_URL}/GetUnplannedVistListUserSide`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  UpdatedNotificationStatusOfUser(InvitePayload): Observable<any> {
    const url =  `${this.API_USERS_URL}/UpdatedNotificationStatusOfUser?InviteId=${InvitePayload}`;
    return this.http.post<any>(url,null).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  CheckInVisitByQR(visitorId: any,inviteId:any): Observable<visitorResponse> {
    const url = `${this.API_QR_URL}/CheckInVisit?visitorId=${visitorId}&inviteId=${inviteId}`;
    return this.http.post<visitorResponse>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  CheckOutVisitByQR(visitorId: any,inviteId:any): Observable<visitorResponse> {
    const url = `${this.API_QR_URL}/CheckOutVisit?visitorId=${visitorId}&inviteId=${inviteId}`;
    return this.http.post<visitorResponse>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  GetVisitorDetailsByInvitecode(id:any): Observable<visitorResponse> {
    const url = `${this.API_USERS_URL}/GetVisitorDetailsByInvitecode?InviteCode=${id}`;
    return this.http.get<visitorResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }
  GetVisitorDetailsByPhoneNumber(number: number): Observable<visitorResponseById> {
    const url = `${this.API_USERS_URL}/GetVisitorDetailsByPhoneNumber?phoneNumber=${number}`;
    return this.http.get<visitorResponseById>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponseById>;
  }
  GetWatchlist(): Observable<getWatchListResponse> {
    const url =  `${this.API_USERS_URL}/GetWatchlist`;
    return this.http.get<getWatchListResponse>(url).pipe(
      map((res:getWatchListResponse) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<getWatchListResponse>;
  }
  GetGroupInviteDetails(): Observable<getMultipleInviteResponse> {
    const url =  `${this.API_USERS_URL}/GetGroupInviteDetails`;
    return this.http.get<getMultipleInviteResponse>(url).pipe(
      map((res:getMultipleInviteResponse) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<getMultipleInviteResponse>;
  }
  GetVisitorCategory(): Observable<visitorCategoryResponse> {
    const url =  `${this.API_USERS_URL}/GetVisitorCategory`;
    return this.http.get<visitorCategoryResponse>(url).pipe(
      map((res:visitorCategoryResponse) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorCategoryResponse>;
  }
  GetApprovalStatus(visId:number): Observable<any> {
    const url = `${this.API_USERS_URL}/GetApprovalStatus?VisitorId=${visId}`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
