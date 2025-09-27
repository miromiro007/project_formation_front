import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthModule } from './features/auth/auth.module';
import { ValidateCodeComponent } from './features/auth/validate-code/validate-code.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },// redirige /auth vers /auth/register
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'validate-code', component: ValidateCodeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'formations', loadChildren: () => import('./features/formations/formations.module').then(m => m.FormationsModule) },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
