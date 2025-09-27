import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Auto-login si token valide détecté
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          console.log('Connexion automatique : utilisateur déjà connecté', user);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    console.log('Tentative de connexion avec:', { email, password });
    console.log('Envoi login:', this.loginForm.value);

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de la connexion:', err);
        this.errorMessage = err.error?.message || 'Erreur lors de la connexion';
      }
    });
  }


   goToRegister(): void {
    this.router.navigate(['/register']);
  }

  openForgotPasswordPage(): void {
    this.router.navigate(["/forgot-password"])
  }
}
