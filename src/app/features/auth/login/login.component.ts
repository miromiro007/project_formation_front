import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';
  private authSubscription!: Subscription;

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

    // Vérifier si l'utilisateur est déjà connecté
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.redirectBasedOnRole(user.role);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.redirectBasedOnRole(res.user?.role);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la connexion';
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    switch(role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'user':
        this.router.navigate(['/user-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  openForgotPasswordPage(): void {
    this.router.navigate(['/forgot-password']);
  }
}
