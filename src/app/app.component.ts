import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { MatBottomSheetModule, MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticationService } from './auth/services';
import { environment } from '../environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';



@Component({
  selector: 'app-root',
  standalone: true,
  // imports: [CommonModule, RouterOutlet, HttpClientModule, MatBottomSheetModule, HeaderComponent, SideNavComponent, BreadcrumbListComponent, NoDataComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    
  }
  title = 'Templater-App';
  // menuStatus: boolean = false;
  // userDetail: IuserDetail = null;
  // selectedApp: IappList = null;
  // menuUserAccess: boolean = false;

  // constructor(
  //   private updates: SwUpdate,
  //   private bottomSheet: MatBottomSheet,
  //   private authenticationService: AuthenticationService,
  //   private menuUserAccessService: MenuUserAccessService
  // ){}

  // ngOnInit(): void {
  //   this.authenticationService.user.subscribe(user => {
  //     this.userDetail = user ? user : null;
  //     //console.log(user);
  //   });
  //   this.menuUserAccessService.currentMessage.subscribe((message: boolean) => {
  //     this.menuUserAccess = message;
  //     //console.log(this.menuUserAccess);
  //   })
  //   this.appUpdate();
  // }

  // appUpdate(){
  //   if(environment.production){
  //     if(this.updates.isEnabled){
  //       this.updates.versionUpdates.subscribe(evt => {
  //         switch (evt.type) {
  //           case 'VERSION_DETECTED':
  //             console.log(`Downloading new app version: ${evt.version.hash}`);
  //             break;
  //           case 'VERSION_READY':
  //             const bottomSheetRef = this.bottomSheet.open(AppUpdateComponent, {
  //               data: 'New app version available to update please confirm'
  //             });
  //             bottomSheetRef.afterDismissed().subscribe((data: string) => {
  //               if(data){document.location.reload()}
  //             });
  //             console.log(`Current app version: ${evt.currentVersion.hash}`);
  //             console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
  //             break;
  //           case 'VERSION_INSTALLATION_FAILED':
  //             console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
  //             break;
  //         }
  //       });
  //     }
  //   }
  //   else{
  //     if(window.navigator && navigator.serviceWorker) {
  //       navigator.serviceWorker.getRegistrations()
  //       .then(function(registrations) {
  //         for(let registration of registrations) {
  //           registration.unregister();
  //         }
  //       });
  //     }
  //   }
  // }

  // receiveMenuStatus($event:boolean){
  //   this.menuStatus = $event;
  // }

  // receiveAppStatus($event:IappList){
  //   this.selectedApp = $event;
  // }
}
