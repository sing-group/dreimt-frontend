import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoGeneListsComponent } from './two-gene-lists.component';

describe('TwoGeneListsComponent', () => {
  let component: TwoGeneListsComponent;
  let fixture: ComponentFixture<TwoGeneListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoGeneListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoGeneListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
