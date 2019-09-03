import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapGeneSetSignatureResultsViewComponent } from './cmap-gene-set-signature-results-view.component';

describe('CmapGeneSetSignatureResultsViewComponent', () => {
  let component: CmapGeneSetSignatureResultsViewComponent;
  let fixture: ComponentFixture<CmapGeneSetSignatureResultsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapGeneSetSignatureResultsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapGeneSetSignatureResultsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
