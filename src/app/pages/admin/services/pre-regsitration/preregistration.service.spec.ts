import { TestBed } from '@angular/core/testing';

import { PreregistrationService } from './preregistration.service';

describe('PreregistrationService', () => {
  let service: PreregistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreregistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
