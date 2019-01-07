import { TestBed } from '@angular/core/testing';

import { JaccardResultsService } from './jaccard-results.service';

describe('JaccardResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JaccardResultsService = TestBed.get(JaccardResultsService);
    expect(service).toBeTruthy();
  });
});
