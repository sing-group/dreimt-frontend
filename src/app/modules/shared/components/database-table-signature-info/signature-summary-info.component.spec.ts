import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureSummaryInfoComponent } from './signature-summary-info.component';

describe('SignatureSummaryInfoComponent', () => {
  let component: SignatureSummaryInfoComponent;
  let fixture: ComponentFixture<SignatureSummaryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureSummaryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureSummaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
