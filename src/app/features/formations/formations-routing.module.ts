import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormationListComponent } from './formation-list/formation-list.component';
import { FormationCreateComponent } from './formation-create/formation-create.component';
import { FormationEditComponent } from './formation-edit/formation-edit.component';

const routes: Routes = [
  { path: '', component: FormationListComponent },
  { path: 'create', component: FormationCreateComponent },
  { path: 'edit/:id', component: FormationEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationsRoutingModule { }
