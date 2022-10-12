import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletePopupComponent } from './user-delete-popup.component';

describe('UserDeletePopupComponent', () => {
  let component: UserDeletePopupComponent;
  let fixture: ComponentFixture<UserDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDeletePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
