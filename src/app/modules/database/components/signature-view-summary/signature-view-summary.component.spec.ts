import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureViewSummaryComponent } from './signature-view-summary.component';

describe('SignatureViewSummaryComponent', () => {
  let component: SignatureViewSummaryComponent;
  let fixture: ComponentFixture<SignatureViewSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureViewSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
