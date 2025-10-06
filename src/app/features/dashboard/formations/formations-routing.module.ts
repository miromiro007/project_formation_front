import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormationCreateComponent } from './formation-create/formation-create.component';
import { FormationListComponent } from './formation-list/formation-list.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';


const routes: Routes = [
  { path: '', component: FormationListComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationsRoutingModule { }
