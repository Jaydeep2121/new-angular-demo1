import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  @Input() text: string = '';
  navigate:string='';
  @Output() onClick:EventEmitter<boolean> = new EventEmitter();

  backClick(){
    this.navigate = localStorage.getItem('isNextButton');
    (this.navigate==='reg&check')?this.onClick.emit(false):this.onClick.emit(true);
  }
}
