import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideFieldComponent } from './hide-field.component';

describe('HideFieldComponent', () => {
  let component: HideFieldComponent;
  let fixture: ComponentFixture<HideFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
