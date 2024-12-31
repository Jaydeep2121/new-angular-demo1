import { TestBed } from '@angular/core/testing';

import { MenuUserAccessService } from './menu-user-access.service';

describe('MenuUserAccessService', () => {
  let service: MenuUserAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuUserAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
