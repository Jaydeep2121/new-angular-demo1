import { TestBed } from '@angular/core/testing';

import { YearSelectService } from './year-select.service';

describe('YearSelectService', () => {
  let service: YearSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
