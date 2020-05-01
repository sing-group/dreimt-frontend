import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaccardResultsViewComponent } from './jaccard-results-view.component';

describe('JaccardResultsViewComponent', () => {
  let component: JaccardResultsViewComponent;
  let fixture: ComponentFixture<JaccardResultsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaccardResultsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaccardResultsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
