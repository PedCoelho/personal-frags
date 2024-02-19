import { TestBed } from '@angular/core/testing';

import { PerfumeSearchService } from './perfume-search.service';

describe('PerfumeSearchService', () => {
  let service: PerfumeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfumeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
