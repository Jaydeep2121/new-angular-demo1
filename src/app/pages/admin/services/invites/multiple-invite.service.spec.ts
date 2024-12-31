import { TestBed } from '@angular/core/testing';

import { multipleInvitesService } from './multiple-invites.service';

describe('InvitesService', () => {
  let service: multipleInvitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(multipleInvitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
