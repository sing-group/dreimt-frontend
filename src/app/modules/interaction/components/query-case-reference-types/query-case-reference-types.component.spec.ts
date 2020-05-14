import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCaseReferenceTypesComponent } from './query-case-reference-types.component';

describe('QueryCaseReferenceTypesComponent', () => {
  let component: QueryCaseReferenceTypesComponent;
  let fixture: ComponentFixture<QueryCaseReferenceTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryCaseReferenceTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryCaseReferenceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
