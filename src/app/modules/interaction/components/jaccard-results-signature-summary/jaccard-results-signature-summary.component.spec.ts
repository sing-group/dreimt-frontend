import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaccardResultsSignatureSummaryComponent } from './jaccard-results-signature-summary.component';

describe('JaccardResultsSignatureSummaryComponent', () => {
  let component: JaccardResultsSignatureSummaryComponent;
  let fixture: ComponentFixture<JaccardResultsSignatureSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaccardResultsSignatureSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaccardResultsSignatureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
