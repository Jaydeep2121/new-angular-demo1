import { TestBed } from '@angular/core/testing';

import { CheckinRequestApproveService } from './checkin-request-approve.service';

describe('CheckinRequestApproveService', () => {
  let service: CheckinRequestApproveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckinRequestApproveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
