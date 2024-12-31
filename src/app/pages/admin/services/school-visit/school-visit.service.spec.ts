import { TestBed } from '@angular/core/testing';

import { SchoolVisitService } from './school-visit.service';

describe('SchoolVisitService', () => {
  let service: SchoolVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
