import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { WatchListComponent } from './watch-list/watch-list.component';
import { LayoutComponent } from '../../layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VisitorComponent } from './visitor/visitor.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { MultipleInviteComponent } from './multiple-invite/multiple-invite.component';
import { InvitesComponent } from './invites/invites.component';
import { CheckinRequestApproveComponent } from './checkin-request-approve/checkin-request-approve.component';
import { ManageGatesComponent } from './manage-gates/manage-gates.component';
import { GroupsComponent } from './groups/groups.component';
import { ReportsComponent } from './reports/reports.component';
import { SchoolVisitComponent } from './school-visit/school-visit.component';
import { UserMasterComponent } from '../master/user-master/user-master.component';

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
        component: DashboardComponent,
        data: { title: 'Dashboard' }
      },
      {
        path: 'visitor',
        component: VisitorComponent,
        data: { title: 'Visitor' }
      },
      {
        path: 'watch-list',
        component: WatchListComponent,
        data: { title: 'Watch List' }
      },
      {
        path: 'manage-gates',
        component: ManageGatesComponent,
        data: { title: 'Manage Gates' }
      },
      {
        path: 'checkin-approved-request',
        component: CheckinRequestApproveComponent,
        data: { title: 'CheckIn Approval' }
      },
      {
        path: 'groups',
        component: GroupsComponent,
        data: { title: 'Groups' }
      },
      {
        path: 'school-visit',
        component: SchoolVisitComponent,
        data: { title: 'School Configuration' }
      },
      {
        path: 'user-info',
        component: UserinfoComponent,
        data: { title: 'User Info' }
      },
      {
        path: 'multiple-invites',
        component: MultipleInviteComponent,
        data: { title: 'Multiple Invites' }
      },
      {
        path: 'invites',
        component: InvitesComponent,
        data: { title: 'Invites' }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Reports' }
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
export class AdminRoutingModule {
}
