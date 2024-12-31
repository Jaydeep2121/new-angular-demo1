import { TestBed } from '@angular/core/testing';

import { SiteMasterService } from './site-master.service';

describe('SiteMasterService', () => {
  let service: SiteMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
