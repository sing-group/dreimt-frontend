import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypergeometricDistributionPlotComponent } from './hypergeometric-distribution-plot.component';

describe('HypergeometricDistributionPlotComponent', () => {
  let component: HypergeometricDistributionPlotComponent;
  let fixture: ComponentFixture<HypergeometricDistributionPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypergeometricDistributionPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypergeometricDistributionPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
