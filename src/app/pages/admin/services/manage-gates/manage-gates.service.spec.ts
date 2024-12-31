import { TestBed } from '@angular/core/testing';

import { ManageGatesService } from './manage-gates.service';

describe('ManageGatesService', () => {
  let service: ManageGatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageGatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
