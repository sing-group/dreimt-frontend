import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotDrugStatusComponent } from './plot-drug-status.component';

describe('PlotDrugStatusComponent', () => {
  let component: PlotDrugStatusComponent;
  let fixture: ComponentFixture<PlotDrugStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotDrugStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotDrugStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
