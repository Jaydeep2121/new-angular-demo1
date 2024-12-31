import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolVisitComponent } from './school-visit.component';

describe('SchoolVisitComponent', () => {
  let component: SchoolVisitComponent;
  let fixture: ComponentFixture<SchoolVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolVisitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
