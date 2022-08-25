import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByMenuComponent } from './group-by-menu.component';

describe('GroupByMenuComponent', () => {
  let component: GroupByMenuComponent;
  let fixture: ComponentFixture<GroupByMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupByMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupByMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
