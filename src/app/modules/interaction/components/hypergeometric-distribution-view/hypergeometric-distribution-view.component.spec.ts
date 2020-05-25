import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypergeometricDistributionViewComponent } from './hypergeometric-distribution-view.component';

describe('HypergeometricDistributionViewComponent', () => {
  let component: HypergeometricDistributionViewComponent;
  let fixture: ComponentFixture<HypergeometricDistributionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypergeometricDistributionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypergeometricDistributionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
