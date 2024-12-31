import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  template:`<router-outlet></router-outlet>`,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    document.body.classList.add('bg-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-body');
  }
}
