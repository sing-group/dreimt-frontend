import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureViewGraphComponent } from './signature-view-graph.component';

describe('SignatureViewGraphComponent', () => {
  let component: SignatureViewGraphComponent;
  let fixture: ComponentFixture<SignatureViewGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureViewGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureViewGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
