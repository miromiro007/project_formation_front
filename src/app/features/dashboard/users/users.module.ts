import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';



@NgModule({
  declarations: [
    UserListComponent,
    UserProfileComponent,

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,

  ],
  exports: [UserListComponent,],
})
export class UsersModule { }
