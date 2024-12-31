import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageGatesComponent } from './add-manage-gates.component';

describe('AddManageGatesComponent', () => {
  let component: AddManageGatesComponent;
  let fixture: ComponentFixture<AddManageGatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddManageGatesComponent]
    });
    fixture = TestBed.createComponent(AddManageGatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
