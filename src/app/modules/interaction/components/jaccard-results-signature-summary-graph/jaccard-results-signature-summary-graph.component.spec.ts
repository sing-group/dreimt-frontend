import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaccardResultsSignatureSummaryGraphComponent } from './jaccard-results-signature-summary-graph.component';

describe('JaccardResultsSignatureSummaryGraphComponent', () => {
  let component: JaccardResultsSignatureSummaryGraphComponent;
  let fixture: ComponentFixture<JaccardResultsSignatureSummaryGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaccardResultsSignatureSummaryGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaccardResultsSignatureSummaryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
