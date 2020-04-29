import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlDialogComponent } from './html-dialog.component';

describe('HtmlDialogComponent', () => {
  let component: HtmlDialogComponent;
  let fixture: ComponentFixture<HtmlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
