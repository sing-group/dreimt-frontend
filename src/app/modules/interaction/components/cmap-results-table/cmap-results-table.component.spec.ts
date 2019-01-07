import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapResultsTableComponent } from './cmap-results-table.component';

describe('CmapResultsTableComponent', () => {
  let component: CmapResultsTableComponent;
  let fixture: ComponentFixture<CmapResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
