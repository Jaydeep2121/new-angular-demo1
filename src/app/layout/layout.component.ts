import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgModule,
  HostListener,
} from '@angular/core';
// import { LayoutService } from './core/layout.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { filter, map, mergeMap } from 'rxjs';
import { TitleService } from '../pages/admin/services/title/title.service';
import { LayoutService } from './core/layout.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    RouterModule,
    ContentComponent,
    AsideComponent,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
  isSmallScreen: boolean = window.innerWidth < 992;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = event.target.innerWidth < 992;
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: TitleService, private layout: LayoutService) {}

  ngOnInit() {
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.setTitleFromRouteData();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'];
      this.titleService.setTitle(title);
    });
  }

  setTitleFromRouteData() {
    const childRoute = this.activatedRoute.firstChild;
    if (childRoute && childRoute.snapshot.data && childRoute.snapshot.data['title']) {
      const title = childRoute.snapshot.data['title'];
      this.titleService.setTitle(title);
    }
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }
  }
}
