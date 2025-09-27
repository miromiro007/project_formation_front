import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormationService } from 'src/app/core/services/formation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formation-create',
  templateUrl: './formation-create.component.html',
  styleUrls: ['./formation-create.component.css']
})
export class FormationCreateComponent {
  titre = '';
  domaine = '';
  description = '';
  dateDebut = '';
  dateFin = '';
  minPlace = 1;
  maxPlace = 10;
  errorMsg = '';

  constructor(
    private formationService: FormationService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.titre || !this.domaine || !this.dateDebut || !this.dateFin) {
      this.errorMsg = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const formation = {
      id: '',
      titre: this.titre,
      domaine: this.domaine,
      description: this.description,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      minPlace: this.minPlace,
      maxPlace: this.maxPlace
    };

    const token = this.authService.getToken();
    if (!token) {
      this.errorMsg = 'Vous devez être connecté.';
      return;
    }

    this.formationService.addFormation(formation, token).subscribe({
      next: () => {
        this.router.navigate(['/formations']);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Erreur lors de la création.';
      }
    });
  }
}
