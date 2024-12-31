import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { protectedResources } from '../../auth/configuration';
import { IuserDetail } from '../../services/sel.interface';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public userSubject: BehaviorSubject<IuserDetail | null>;
    public user: Observable<IuserDetail | null>;

    constructor(
        private http: HttpClient,
        private snackBarService: SnackBarService
    ){
        this.userSubject = new BehaviorSubject<IuserDetail | null>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiURL}users/authenticate`, { username, password }, { withCredentials: true })
            .pipe(map(user => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    getUserDetail(appName: string, randomNumber: string, accessLevel: string){
        return this.http.get<any>(`${environment.apiURL}${protectedResources.MenuNavigation.resourceUri}/${randomNumber}/${accessLevel}`, { withCredentials: false })
            .pipe(map(user => {
                if(typeof user === 'string'){
                    this.snackBarService.error(user, 'ok');
                    return false;
                }
                else{
                    this.userSubject.next(user);
                    this.startRefreshTokenTimer();
                    localStorage.setItem('sel-vms-user', JSON.stringify(user));
                    return user;
                }
            }));
    }

    logout() {
        this.http.post<any>(`${environment.apiURL}${protectedResources.RevokeToken.resourceUri}`, {token: this.userValue.jwtToken}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        localStorage.removeItem('sel-vms-user');
        //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
    }

    refreshToken() {
        return this.http.post<any>(`${environment.apiURL}${protectedResources.RefreshToken.resourceUri}`, {token: this.userValue.jwtToken}, { withCredentials: true })
            .pipe(map((user) => {
                this.userValue.jwtToken = user.jwtToken;
                localStorage.setItem('sel-vms-user', JSON.stringify(user));
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    private refreshTokenTimeout?: NodeJS.Timeout;

    private startRefreshTokenTimer() {
        const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}