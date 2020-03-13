import { TestBed } from '@angular/core/testing';

import { DreimtInformationService } from './dreimt-information.service';

describe('DreimtInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DreimtInformationService = TestBed.get(DreimtInformationService);
    expect(service).toBeTruthy();
  });
});
