import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationsRoutingModule } from './formations-routing.module';
import { FormationListComponent } from './formation-list/formation-list.component';
import { FormationCreateComponent } from './formation-create/formation-create.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormationListComponent,
    FormationCreateComponent,
    FormationEditComponent
  ],
  imports: [
    CommonModule,
    FormationsRoutingModule,
    FormsModule
  ],
  exports: [  // EXPORTER ici
    FormationListComponent,
    FormationCreateComponent,
    FormationEditComponent
  ]
})
export class FormationsModule { }
