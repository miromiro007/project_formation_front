import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-validate-code',
  templateUrl: './validate-code.component.html',
  styleUrls: ['./validate-code.component.css']
})
export class ValidateCodeComponent implements OnInit {
  validateForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email') || '';

    this.validateForm = this.fb.group({
      email: [emailFromQuery, [Validators.required, Validators.email]],
      code: ['', Validators.required]
    });
  }

  get f() { return this.validateForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.validateForm.invalid) return;

    this.authService.validateCode(this.validateForm.value).subscribe({
      next: res => {
        this.successMessage = res.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Code invalide';
      }
    });
  }
}
