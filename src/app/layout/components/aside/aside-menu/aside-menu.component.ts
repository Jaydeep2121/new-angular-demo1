import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside-menu',
  imports:[SharedModule,RouterModule],
  standalone:true,
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  userType:string='';
  private accessType = environment.accessType;


  constructor() {}

  ngOnInit(): void {
    this.userType=localStorage.getItem(this.accessType)!;
  }
}
