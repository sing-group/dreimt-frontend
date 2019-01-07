import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaccardResultsTableComponent } from './jaccard-results-table.component';

describe('JaccardResultsTableComponent', () => {
  let component: JaccardResultsTableComponent;
  let fixture: ComponentFixture<JaccardResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaccardResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaccardResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
