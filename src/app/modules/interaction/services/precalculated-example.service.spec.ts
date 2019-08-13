import { TestBed } from '@angular/core/testing';

import { PrecalculatedExampleService } from './precalculated-example.service';

describe('PrecalculatedExampleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrecalculatedExampleService = TestBed.get(PrecalculatedExampleService);
    expect(service).toBeTruthy();
  });
});
