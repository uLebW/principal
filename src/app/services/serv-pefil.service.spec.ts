import { TestBed } from '@angular/core/testing';

import { ServPefilService } from './serv-pefil.service';

describe('ServPefilService', () => {
  let service: ServPefilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServPefilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
