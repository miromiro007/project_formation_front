import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { FormationsModule } from './formations/formations.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent,
    EditProfileComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    FormationsModule,
    ReservationsModule,
    UsersModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule { }
