import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { SchoolMasterComponent } from './school-master/school-master.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { SiteMasterComponent } from './site-master/site-master.component';

const ROUTES:Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'school-master',
      },
      {
        path: 'school-master',
        component: SchoolMasterComponent,
        data: { title: 'School Master' }
      },
      {
        path: 'site-master',
        component: SiteMasterComponent,
        data: { title: 'Site Master' }
      },
      {
        path: 'user-master',
        component: UserMasterComponent,
        data: { title: 'User Master' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class MasterRoutingModule
 {
}