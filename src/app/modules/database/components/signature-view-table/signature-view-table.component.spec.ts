import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureViewTableComponent } from './signature-view-table.component';

describe('SignatureViewTableComponent', () => {
  let component: SignatureViewTableComponent;
  let fixture: ComponentFixture<SignatureViewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureViewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
