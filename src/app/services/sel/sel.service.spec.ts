import { TestBed } from '@angular/core/testing';

import { SelService } from './sel.service';

describe('SelService', () => {
  let service: SelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
