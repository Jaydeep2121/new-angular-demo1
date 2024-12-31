import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBodyComponent } from './notification-body.component';

describe('NotificationBodyComponent', () => {
  let component: NotificationBodyComponent;
  let fixture: ComponentFixture<NotificationBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
