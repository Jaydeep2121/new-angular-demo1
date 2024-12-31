import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleInviteComponent } from './multiple-invite.component';

describe('MultipleInviteComponent', () => {
  let component: MultipleInviteComponent;
  let fixture: ComponentFixture<MultipleInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleInviteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
