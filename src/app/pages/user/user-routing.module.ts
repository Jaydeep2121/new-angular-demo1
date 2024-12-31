import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckIn1Component } from './visitor/check-in/check-in1/check-in1.component';
import { CheckIn2Component } from './visitor/check-in/check-in2/check-in2.component';
import { CheckOutComponent } from './visitor/check-out/check-out.component';
import { QrScanComponent } from './visitor/qr-scan/qr-scan.component';

const ROUTES:Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'checkin',
        component: CheckIn1Component
      },
      {
        path: 'checkin2',
        component: CheckIn2Component
      },
      {
        path: 'checkout',
        component: CheckOutComponent
      },
      {
        path: 'qrscan',
        component: QrScanComponent
      },
      {
        path: 'pre-registration',
        component: CheckIn1Component,
        data: { mode: 'pre-registration' }
      },
      {
        path: 'regster-checkIn',
        component: CheckIn1Component,
        data: { mode: 'regster-checkIn' } 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}