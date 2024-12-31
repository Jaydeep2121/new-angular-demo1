import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';


const modules = [
    OwlDateTimeModule,
    OwlNativeDateTimeModule
];

@NgModule({
  imports: [
    CommonModule,
    ...modules
  ],
  exports:[
    ...modules
  ]
})
export class DatetimepickerModule { }
