import { TestBed } from '@angular/core/testing';

import { AIOverviewService } from './ai-overview.service';

describe('AiOverviewService', () => {
  let service: AIOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
