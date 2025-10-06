import { Component } from '@angular/core';
import { AuthModule } from '../auth.module';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';

  step: 'requestCode' | 'validateCode' | 'resetPassword' = 'requestCode';
  message = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  requestCode() {
    this.message = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Veuillez entrer votre email';
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'Un code a été envoyé à votre email.';
        this.error = '';
        this.isLoading = false;
        this.step = 'validateCode';
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue';
        this.message = '';
        this.isLoading = false;
      }
    });
  }

  validateCode() {
    this.message = '';
    this.error = '';

    if (!this.email || !this.code) {
      this.error = 'Veuillez entrer votre email et le code reçu';
      return;
    }

    this.isLoading = true;
    this.authService.validateCode({ email: this.email, code: this.code }).subscribe({
      next: (res) => {
        this.message = res.message || 'Code validé. Vous pouvez réinitialiser votre mot de passe.';
        this.error = '';
        this.isLoading = false;
        this.step = 'resetPassword';
      },
      error: (err) => {
        this.error = err.error?.message || 'Code invalide ou expiré';
        this.message = '';
        this.isLoading = false;
      }
    });
  }

  resetPassword() {
    this.message = '';
    this.error = '';

    if (!this.email || !this.code || !this.newPassword || !this.confirmPassword) {
      this.error = 'Tous les champs sont requis';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
    if (this.newPassword.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword({
      email: this.email,
      code: this.code,
      password: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Mot de passe réinitialisé avec succès.';
        this.error = '';
        this.isLoading = false;
        this.step = 'requestCode';
        this.email = '';
        this.code = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la réinitialisation';
        this.message = '';
        this.isLoading = false;
      }
    });
  }
}

