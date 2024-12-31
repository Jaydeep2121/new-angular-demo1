import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGatesComponent } from './manage-gates.component';

describe('ManageGatesComponent', () => {
  let component: ManageGatesComponent;
  let fixture: ComponentFixture<ManageGatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageGatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
