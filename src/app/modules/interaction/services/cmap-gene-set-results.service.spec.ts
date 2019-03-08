import { TestBed } from '@angular/core/testing';

import { CmapGeneSetResultsService } from './cmap-gene-set-results.service';

describe('CmapGeneSetResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmapGeneSetResultsService = TestBed.get(CmapGeneSetResultsService);
    expect(service).toBeTruthy();
  });
});
