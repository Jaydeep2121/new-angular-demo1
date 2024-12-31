import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckIn1Component } from './check-in1.component';

describe('CheckIn1Component', () => {
  let component: CheckIn1Component;
  let fixture: ComponentFixture<CheckIn1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckIn1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckIn1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
