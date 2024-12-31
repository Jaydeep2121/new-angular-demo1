import { TestBed } from '@angular/core/testing';

import { MultipleInvitesService } from './multiple-invites.service';

describe('MultipleInvitesService', () => {
  let service: MultipleInvitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleInvitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
