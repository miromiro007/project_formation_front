import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationListEmployeComponent } from './formation-list-employe.component';

describe('FormationListEmployeComponent', () => {
  let component: FormationListEmployeComponent;
  let fixture: ComponentFixture<FormationListEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationListEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationListEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
