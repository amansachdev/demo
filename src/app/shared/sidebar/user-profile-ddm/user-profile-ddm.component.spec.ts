import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDdmComponent } from './user-profile-ddm.component';

describe('UserProfileDdmComponent', () => {
  let component: UserProfileDdmComponent;
  let fixture: ComponentFixture<UserProfileDdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileDdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileDdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
