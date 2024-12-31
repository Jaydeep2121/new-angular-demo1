import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { appInitializer } from './modules/auth/helper/app.initializer';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { catchError, map, throwError } from 'rxjs';
import { provideToastr } from 'ngx-toastr';

const APP_INIT = {
  provide: APP_INITIALIZER,
  useFactory: appInitializer,
  multi: true,
  deps: [AuthService],
}

export const tokenInterceptor : HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) =>{
  // Write your logic 
  let headers = req.headers;
  const token = localStorage.getItem('token') || '';
  
  headers = headers.append('Content-Type', 'application/json');
  if (req.url.endsWith('/Image/UploadImage')) {
    headers = headers.delete('Content-Type'); // Remove Content-Type header
  }
  if (token) {
    headers = headers.append('Authorization', `Bearer ${token}`)
  }
  
  const request = req.clone(
    {
      headers
    });
    return next(request)
    .pipe(
        map((event: HttpEvent<any>) => {
          return event;
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              // user doesn't have access to that module
              // this.router.navigate(['/', 'admin', 'forbidden']);
            }
            if (err.status === 401) {
              // JWT expired, go to login
              if (token) localStorage.removeItem('token');
              location.replace('/');
            }
          }
          return throwError(err.error);
        })
    );
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),APP_INIT, provideAnimations(), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideHttpClient(withInterceptors([tokenInterceptor])),provideToastr()]
};
