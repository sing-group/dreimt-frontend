import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapGeneSetSignatureResultsGraphComponent } from './cmap-gene-set-signature-results-graph.component';

describe('CmapGeneSetSignatureResultsGraphComponent', () => {
  let component: CmapGeneSetSignatureResultsGraphComponent;
  let fixture: ComponentFixture<CmapGeneSetSignatureResultsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapGeneSetSignatureResultsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapGeneSetSignatureResultsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
