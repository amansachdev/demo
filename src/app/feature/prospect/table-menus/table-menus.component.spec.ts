import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMenusComponent } from './table-menus.component';

describe('TableMenusComponent', () => {
  let component: TableMenusComponent;
  let fixture: ComponentFixture<TableMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
