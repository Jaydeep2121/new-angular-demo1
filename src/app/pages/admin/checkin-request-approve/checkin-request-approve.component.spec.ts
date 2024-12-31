import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinRequestApproveComponent } from './checkin-request-approve.component';

describe('CheckinRequestApproveComponent', () => {
  let component: CheckinRequestApproveComponent;
  let fixture: ComponentFixture<CheckinRequestApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckinRequestApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckinRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
