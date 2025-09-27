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
  email: string = '';
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  step: 'requestCode' | 'validateCode' | 'resetPassword' = 'requestCode';

  message: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService,private router : Router) {}

  // Étape 1 : Demander un code
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
        console.log("Réponse forgot-password:", res);
        this.message = res.message || 'Un code a été envoyé à votre email.';
        this.error = '';
        this.isLoading = false;
        this.step = 'validateCode';  // passer à l'étape suivante
      },
      error: (err) => {
        console.error('Erreur forgot-password:', err);
        this.error = err.error?.message || 'Une erreur est survenue';
        this.message = '';
        this.isLoading = false;
      }
    });
  }

  // Étape 2 : Valider le code
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
        console.log("Réponse validate-code:", res);
        this.message = res.message || 'Code validé. Vous pouvez réinitialiser votre mot de passe.';
        this.error = '';
        this.isLoading = false;
        this.step = 'resetPassword';  // passer à l'étape suivante
      },
      error: (err) => {
        console.error('Erreur validate-code:', err);
        this.error = err.error?.message || 'Code invalide ou expiré';
        this.message = '';
        this.isLoading = false;
      }
    });
  }

  // Étape 3 : Réinitialiser le mot de passe
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

    this.isLoading = true;
    this.authService.resetPassword({
      email: this.email,
      code: this.code,
      password: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        console.log("Réponse reset-password:", res);
        this.message = res.message || 'Mot de passe réinitialisé avec succès.';
        this.error = '';
        this.isLoading = false;

        // Réinitialiser l'état ou rediriger vers login
        this.step = 'requestCode';
        this.email = '';
        this.code = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.router.navigate(['/login'])
      },
      error: (err) => {
        console.error('Erreur reset-password:', err);
        this.error = err.error?.message || 'Erreur lors de la réinitialisation';
        this.message = '';
        this.isLoading = false;
      }
    });
  }
}
