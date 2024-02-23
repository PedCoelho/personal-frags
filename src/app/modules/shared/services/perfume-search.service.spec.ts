import { TestBed } from '@angular/core/testing';

import { PerfumeSearchModule } from '../components/perfume-search/perfume-search.module';
import { PerfumeSearchService } from './perfume-search.service';

describe('PerfumeSearchService', () => {
  let service: PerfumeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PerfumeSearchModule],
    });
    service = TestBed.inject(PerfumeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
