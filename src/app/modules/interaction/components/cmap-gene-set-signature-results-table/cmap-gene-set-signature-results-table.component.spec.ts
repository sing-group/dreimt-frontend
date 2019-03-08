import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CmapGeneSetSignatureResultsTableComponent} from './cmap-gene-set-signature-results-table.component';

describe('CmapGeneSetSignatureResultsTableComponent', () => {
  let component: CmapGeneSetSignatureResultsTableComponent;
  let fixture: ComponentFixture<CmapGeneSetSignatureResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CmapGeneSetSignatureResultsTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapGeneSetSignatureResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
