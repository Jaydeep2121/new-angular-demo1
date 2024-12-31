import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
@Component({
  selector: 'app-content',
  standalone:true,
  imports: [
    SharedModule,
    RouterModule
  ],
  template:`<router-outlet></router-outlet>`,
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // DrawerComponent.hideAll();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
