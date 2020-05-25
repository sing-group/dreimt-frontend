import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypergeometricDistributionTableComponent } from './hypergeometric-distribution-table.component';

describe('HypergeometricDistributionTableComponent', () => {
  let component: HypergeometricDistributionTableComponent;
  let fixture: ComponentFixture<HypergeometricDistributionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypergeometricDistributionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypergeometricDistributionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
