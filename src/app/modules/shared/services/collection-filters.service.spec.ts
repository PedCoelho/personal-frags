import { TestBed } from '@angular/core/testing';

import { CollectionFiltersService } from './collection-filters.service';

describe('CollectionFiltersService', () => {
  let service: CollectionFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
