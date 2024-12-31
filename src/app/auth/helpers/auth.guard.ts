import { Injectable, inject } from '@angular/core';
//import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { AuthenticationService } from '../services';

//@Injectable({ providedIn: 'root' })

export const AuthGuard = () => {
    const authenticationService = inject(AuthenticationService);
    const user = authenticationService.userValue;
    if(user){
        return true;
    }
    else{
        var getURL = window.location.href;
        var urlValue = new URL(getURL);
        var appName = urlValue.searchParams.get("ToApps");
        var randomNumber = urlValue.searchParams.get("RndNo");
        var accessLevel = urlValue.searchParams.get("AccessLevel");
        if(appName && randomNumber && accessLevel){
            authenticationService.getUserDetail(appName, randomNumber, accessLevel)
            .pipe(first())
            .subscribe({
                next: (user) => {
                    if(user){
                        return true;
                    }
                    else{
                        localStorage.removeItem('sel-vms-user');
                        //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
                        return false;
                    }
                },
                error: error => {
                    localStorage.removeItem('sel-vms-user');
                    //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
                    return false;
                }
            });
            //console.log(appName, randomNumber, accessLevel);
        }
        else{
            let checkUserDetail = JSON.parse(localStorage.getItem("sel-vms-user"));
            if(checkUserDetail){
                authenticationService.userValue === null ? authenticationService.userSubject.next(checkUserDetail) : '';
                return true;
            }
            else{
                localStorage.removeItem('sel-vms-user');
                //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
                return false;
            } 
        }
    }
}
// export class AuthGuard implements CanActivate {
//     constructor(
//         private router: Router,
//         private authenticationService: AuthenticationService
//     ) { }

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         const user = this.authenticationService.userValue;
//         if(user){
//             return true;
//         }
//         else{
//             var getURL = window.location.href;
//             var urlValue = new URL(getURL);
//             var appName = urlValue.searchParams.get("Toapps");
//             var randomNumber = urlValue.searchParams.get("RndNo");
//             var accessLevel = urlValue.searchParams.get("AccessLevel");
//             if(appName && randomNumber && accessLevel){
//                 this.authenticationService.getUserDetail(appName, randomNumber, accessLevel)
//                 .pipe(first())
//                 .subscribe({
//                     next: (user) => {
//                         if(user){
//                             return true;
//                         }
//                         else{
//                             localStorage.removeItem('sel-vms-user');
//                             //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
//                             localStorage.clear();
//                             sessionStorage.clear();
//                             window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
//                             return false;
//                         }
//                     },
//                     error: error => {
//                         localStorage.removeItem('sel-vms-user');
//                         //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
//                         localStorage.clear();
//                         sessionStorage.clear();
//                         window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
//                         return false;
//                     }
//                 });
//                 //console.log(appName, randomNumber, accessLevel);
//             }
//             else{
//                 let checkUserDetail = JSON.parse(localStorage.getItem("sel-vms-user"));
//                 if(checkUserDetail){
//                     this.authenticationService.userValue === null ? this.authenticationService.userSubject.next(checkUserDetail) : '';
//                     return true;
//                 }
//                 else{
//                     localStorage.removeItem('sel-vms-user');
//                     //window.location.replace(`${environment.linkURL}Login.aspx?Status=L`);
//                     localStorage.clear();
//                     sessionStorage.clear();
//                     window.location.replace(`${environment.production ? window.location.origin : environment.redirectURL}/scgen/Login.aspx?Status=L`);
//                     return false;
//                 } 
//             }
//         }
//     }
// }