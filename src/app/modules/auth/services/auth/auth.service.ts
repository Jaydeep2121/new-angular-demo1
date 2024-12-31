import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';

import { AuthHTTPService } from './auth-http/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { LOGIN_SUCCESS_RESPONSE, USER_DETAILS_BY_TOKEN, schoolSiteDetailsResponse, schoolSitePayload } from '../../models/login-response.model';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../../models/login.model';
import { VisitorService } from '../../../../pages/admin/services/visitors/visitor.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;
  private accessType = environment.accessType;

  // public fields
  currentUser$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private visitorService: VisitorService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  login(credential:LOGIN_CREDENTIAL_PAYLOAD): Observable<LOGIN_SUCCESS_RESPONSE> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(credential).pipe(
      tap((res: any) => {
        if (res?.value) {
          localStorage.setItem("token", res?.value.jwtToken)
        }
      }),
      map((res: LOGIN_SUCCESS_RESPONSE) => {
        if (res.response.returnNumber===200) {
          const result = this.setAuthFromLocalStorage(res);
          let role = '';
          if (res.value.type==1) {
            role = 'admin'
          }else if (res.value.type==2) {
            role = 'user'
          }else if (res.value.type==3) {
            role = 'master'
          }
          localStorage.setItem(this.accessType,role);
          return result;
        }else{
          this.toastr.error(res.response?.errorMessage, 'Error', {timeOut: 3000});
        }
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        this.toastr.error('Something went wrong.try again!', 'Error', {timeOut: 3000});
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.value.jwtToken) {
      this.logout();
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    let role = '';
    if (auth.value.type==1) {
      role = 'admin'
    }else if (auth.value.type==2) {
      role = 'user'
    }else if (auth.value.type==3) {
      role = 'master'
    }
    const data = {
      username:auth.value.userID,
      role
    }
    this.currentUserSubject.next(data);
    this.visitorService.getVisitorCountryStateCityList().subscribe();
    return of(auth);
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  private getAuthFromLocalStorage(): any | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private setAuthFromLocalStorage(auth: LOGIN_SUCCESS_RESPONSE): any {    
    if (auth && auth.value.jwtToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  getSchoolSiteDetails(payload:schoolSitePayload): Observable<schoolSiteDetailsResponse> {
    return this.authHttpService.GetSchoolSiteDetails(payload);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
