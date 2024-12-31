import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleInvitesComponent } from './add-multiple-invites.component';

describe('AddInvitesComponent', () => {
  let component: AddMultipleInvitesComponent;
  let fixture: ComponentFixture<AddMultipleInvitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMultipleInvitesComponent]
    });
    fixture = TestBed.createComponent(AddMultipleInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
