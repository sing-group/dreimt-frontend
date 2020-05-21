import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBarChartComponent } from './map-bar-chart.component';

describe('MapBarChartComponent', () => {
  let component: MapBarChartComponent;
  let fixture: ComponentFixture<MapBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
