import { Routes } from '@angular/router';
import { AuthGuard } from './auth/helpers';

// export const routes: Routes = [
//     {
//         path: 'home',
//         loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
//         title: 'VMS Form | SEL',
//         canActivate: [AuthGuard],
//         data: {title: 'VMS Form'}
//     },
//     {
//         path: '',
//         redirectTo: 'home',
//         pathMatch: 'full'
//     },
// ];

export const routes:Routes = [
    {
        path: 'auth',
        loadChildren:()=> import('./modules/auth/auth-routing.module').then(mod=>mod.AuthRoutingModule)
    },
    {
        path: '',
        loadChildren: () =>
            import('./layout/layout-routing.module').then((m) => m.layoutRoutingroutesModule),
    },
]