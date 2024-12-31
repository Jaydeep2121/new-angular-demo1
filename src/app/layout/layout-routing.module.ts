import { NgModule } from '@angular/core';
import { AuthGuard } from '../modules/auth/services/auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin'
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('../../app/pages/admin/admin-routing.module').then((m) => m.AdminRoutingModule),  
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { roles: ['user'] },
    loadChildren: () =>
      import('../../app/pages/user/user-routing.module').then((m) => m.UserRoutingModule),
  },
  {
    path: 'master',
    canActivate: [AuthGuard],
    data: { roles: ['master'] },
    loadChildren: () =>
      import('../../app/pages/master/master-routing.module').then((m) => m.MasterRoutingModule),
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class layoutRoutingroutesModule {}