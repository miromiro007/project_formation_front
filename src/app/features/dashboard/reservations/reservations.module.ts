import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Ajout de ReactiveFormsModule
import { ReservationsRoutingModule } from './reservations-routing.module';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationsListEmployeComponent } from './reservations-list-employe/reservations-list-employe.component';


@NgModule({
  declarations: [
    ReservationListComponent,
    ReservationsListEmployeComponent,

  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:
   [ReservationListComponent,
    ReservationsListEmployeComponent,
  ],
})
export class ReservationsModule { }
