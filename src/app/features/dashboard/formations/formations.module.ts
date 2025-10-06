import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormationsRoutingModule } from './formations-routing.module';
import { FormationListComponent } from './formation-list/formation-list.component';
import { FormationCreateComponent } from './formation-create/formation-create.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { RouterModule } from '@angular/router';
import { FormationListEmployeComponent } from './formation-list-employe/formation-list-employe.component';


@NgModule({
  declarations: [
    FormationListComponent,
    FormationCreateComponent,
    FormationEditComponent,
    FormationListEmployeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormationsRoutingModule

  ],
  exports: [
    FormationListComponent,
    FormationCreateComponent,
    FormationEditComponent,
    FormationListEmployeComponent,
  ]
})
export class FormationsModule { }
