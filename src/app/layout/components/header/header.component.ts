import {AfterViewInit, Component,  OnDestroy, OnInit} from '@angular/core';
import { PageTitleComponent } from './page-title/page-title.component';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[PageTitleComponent,AsideComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(){}

  ngOnInit(): void {
      
  }
}
