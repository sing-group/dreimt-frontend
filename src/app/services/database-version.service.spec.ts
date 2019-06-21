import { TestBed } from '@angular/core/testing';

import { DatabaseVersionService } from './database-version.service';

describe('DatabaseVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseVersionService = TestBed.get(DatabaseVersionService);
    expect(service).toBeTruthy();
  });
});
