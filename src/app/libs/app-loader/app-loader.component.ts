import { Component, Input, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-loader',
  standalone:true,
  imports:[CommonModule,NgxSkeletonLoaderModule],
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class AppLoaderComponent implements OnInit {
  @Input() tableStyles: string[] = [];
  rows:number[]=[];
  cols:number[]=[]

  constructor() { }

  ngOnInit(): void {
    this.rows = Array.from({ length: 5 });
    this.cols = Array.from({ length: this.tableStyles.length });
  }

}
