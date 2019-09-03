import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapUpDownSignatureResultsGraphComponent } from './cmap-up-down-signature-results-graph.component';

describe('CmapUpDownSignatureResultsGraphComponent', () => {
  let component: CmapUpDownSignatureResultsGraphComponent;
  let fixture: ComponentFixture<CmapUpDownSignatureResultsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapUpDownSignatureResultsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapUpDownSignatureResultsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
