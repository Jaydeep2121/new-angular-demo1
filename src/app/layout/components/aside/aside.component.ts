import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterModule } from '@angular/router';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { environment } from '../../../../environments/environment';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { AuthService } from '../../../modules/auth/services/auth/auth.service';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-aside',
  standalone:true,
  imports:[SharedModule,AsideMenuComponent,RouterModule,NgbDropdownModule,NgbTooltipModule,InlineSVGModule],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  asideTheme: string = '';
  asideMinimize: boolean = false;
  asideMenuCSSClasses: string = '';
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];
  userType:string=''
  user$: Observable<any>;
  private accessType = environment.accessType;
  isSmallScreen: boolean = window.innerWidth < 992;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < 992;
  }


  constructor(private layout: LayoutService, private router: Router,private auth: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
    this.routingChanges();
    this.userType=localStorage.getItem(this.accessType)!;
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  menuReinitialization() {
    setTimeout(() => {
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
