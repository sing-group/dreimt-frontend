import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotDrugMoaComponent } from './plot-drug-moa.component';

describe('PlotDrugMoaComponent', () => {
  let component: PlotDrugMoaComponent;
  let fixture: ComponentFixture<PlotDrugMoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotDrugMoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotDrugMoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
