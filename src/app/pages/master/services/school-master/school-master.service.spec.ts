import { TestBed } from '@angular/core/testing';

import { SchoolMasterService } from './school-master.service';

describe('SchoolMasterService', () => {
  let service: SchoolMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
