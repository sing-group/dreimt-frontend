import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapUpDownSignatureResultsSummaryComponent } from './cmap-up-down-signature-results-summary.component';

describe('CmapUpDownSignatureResultsSummaryComponent', () => {
  let component: CmapUpDownSignatureResultsSummaryComponent;
  let fixture: ComponentFixture<CmapUpDownSignatureResultsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapUpDownSignatureResultsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapUpDownSignatureResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
