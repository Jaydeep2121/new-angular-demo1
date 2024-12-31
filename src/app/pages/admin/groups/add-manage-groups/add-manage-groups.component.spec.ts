import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageGroupsComponent } from './add-manage-groups.component';

describe('AddManageGatesComponent', () => {
  let component: AddManageGroupsComponent;
  let fixture: ComponentFixture<AddManageGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddManageGroupsComponent]
    });
    fixture = TestBed.createComponent(AddManageGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
