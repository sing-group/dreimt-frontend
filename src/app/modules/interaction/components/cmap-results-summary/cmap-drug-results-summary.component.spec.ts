import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapDrugResultsSummaryComponent } from './cmap-drug-results-summary.component';

describe('CmapDrugResultsSummaryComponent', () => {
  let component: CmapDrugResultsSummaryComponent;
  let fixture: ComponentFixture<CmapDrugResultsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapDrugResultsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapDrugResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
