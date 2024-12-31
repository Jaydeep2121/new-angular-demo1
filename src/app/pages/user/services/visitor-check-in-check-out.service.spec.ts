import { TestBed } from '@angular/core/testing';

import { VisitorCheckInCheckOutService } from './visitor-check-in-check-out.service';

describe('VisitorCheckInCheckOutService', () => {
  let service: VisitorCheckInCheckOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitorCheckInCheckOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
