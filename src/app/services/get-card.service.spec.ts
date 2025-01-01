import { TestBed } from '@angular/core/testing';

import { GetCardService } from './get-card.service';

describe('GetCardService', () => {
  let service: GetCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
