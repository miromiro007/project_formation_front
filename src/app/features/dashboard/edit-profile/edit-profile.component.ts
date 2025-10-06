import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUserValue();
    this.profileForm = this.fb.group({
      email: [user?.email || '', [Validators.required, Validators.email]],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: ['']
    }, { validators: this.passwordConfirming });
  }

  passwordConfirming(c: FormGroup): { invalid: boolean } | null {
    if (c.get('newPassword')?.value !== c.get('confirmPassword')?.value) {
      return { invalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { email, newPassword } = this.profileForm.value;

    const updateData: any = {};
    if (email) {
      updateData.email = email;
    }
    if (newPassword) {
      updateData.password = newPassword;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: () => alert('Profil mis à jour avec succès'),
      error: err => alert('Erreur : ' + (err.error.message || err.message))
    });
  }
}
