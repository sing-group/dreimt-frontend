import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapGeneSetSignatureResultsSummaryComponent } from './cmap-gene-set-signature-results-summary.component';

describe('CmapGeneSetSignatureResultsSummaryComponent', () => {
  let component: CmapGeneSetSignatureResultsSummaryComponent;
  let fixture: ComponentFixture<CmapGeneSetSignatureResultsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapGeneSetSignatureResultsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapGeneSetSignatureResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
