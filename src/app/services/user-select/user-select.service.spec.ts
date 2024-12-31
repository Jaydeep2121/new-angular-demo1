import { TestBed } from '@angular/core/testing';

import { UserSelectService } from './user-select.service';

describe('UserSelectService', () => {
  let service: UserSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
