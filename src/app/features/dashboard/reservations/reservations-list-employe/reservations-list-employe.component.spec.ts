import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsListEmployeComponent } from './reservations-list-employe.component';

describe('ReservationsListEmployeComponent', () => {
  let component: ReservationsListEmployeComponent;
  let fixture: ComponentFixture<ReservationsListEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationsListEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsListEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
