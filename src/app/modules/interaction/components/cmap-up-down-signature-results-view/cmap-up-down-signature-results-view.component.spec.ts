import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmapUpDownSignatureResultsViewComponent } from './cmap-up-down-signature-results-view.component';

describe('CmapUpDownSignatureResultsViewComponent', () => {
  let component: CmapUpDownSignatureResultsViewComponent;
  let fixture: ComponentFixture<CmapUpDownSignatureResultsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmapUpDownSignatureResultsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmapUpDownSignatureResultsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
