import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserInfoComponent } from './add-user-info.component';

describe('AddUserInfoComponent', () => {
  let component: AddUserInfoComponent;
  let fixture: ComponentFixture<AddUserInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserInfoComponent]
    });
    fixture = TestBed.createComponent(AddUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
