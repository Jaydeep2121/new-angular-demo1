import { Component, OnDestroy, OnInit } from '@angular/core';
import { TitleService } from '../../../../pages/admin/services/title/title.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-title',
  standalone:true,
  imports:[CommonModule],
  styles:[
    `
    h1{
      font-size: 22px !important;
    }
    `
  ],
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit, OnDestroy {
  title$:Observable<any>;

  constructor(private titleService: TitleService) {}
  ngOnInit() {
    this.title$ = this.titleService.pageTitle$;
  }

  ngOnDestroy() {
  }
}
