import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecalculatedExamplesComponent } from './precalculated-examples.component';

describe('PrecalculatedExamplesComponent', () => {
  let component: PrecalculatedExamplesComponent;
  let fixture: ComponentFixture<PrecalculatedExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrecalculatedExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecalculatedExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
