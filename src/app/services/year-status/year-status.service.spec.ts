import { TestBed } from '@angular/core/testing';

import { YearStatusService } from './year-status.service';

describe('YearStatusService', () => {
  let service: YearStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
