import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolMasterComponent } from './add-school-master.component';

describe('AddSchoolMasterComponent', () => {
  let component: AddSchoolMasterComponent;
  let fixture: ComponentFixture<AddSchoolMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchoolMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSchoolMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
