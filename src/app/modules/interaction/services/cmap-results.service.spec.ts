import { TestBed } from '@angular/core/testing';

import { CmapResultsService } from './cmap-results.service';

describe('CmapResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmapResultsService = TestBed.get(CmapResultsService);
    expect(service).toBeTruthy();
  });
});
