import { TestBed } from '@angular/core/testing';

import { StatisticalTestsService } from './statistical-tests.service';

describe('StatisticalTestsService', () => {
  let service: StatisticalTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticalTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
