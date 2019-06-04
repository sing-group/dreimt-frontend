import { TestBed } from '@angular/core/testing';

import { CustomIconService } from './custom-icon.service';

describe('CustomIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomIconService = TestBed.get(CustomIconService);
    expect(service).toBeTruthy();
  });
});
