import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { Formation } from '../../../core/models/formation.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-formation-edit',
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.css']
})


export class FormationEditComponent implements OnInit {
  formation: Formation | null = null;
  errorMsg = '';

  // Champs modifiables
  titre = '';
  domaine = '';
  description = '';
  dateDebut = '';
  dateFin = '';
  minPlace = 1;
  maxPlace = 1;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formationService.getFormations({}).subscribe(formations => {
        this.formation = formations.find(f => f.id === id) || null;
        if (this.formation) {
          this.titre = this.formation.titre;
          this.domaine = this.formation.domaine;
          this.description = this.formation.description;
          this.dateDebut = this.formation.dateDebut;
          this.dateFin = this.formation.dateFin;
          this.minPlace = this.formation.minPlace;
          this.maxPlace = this.formation.maxPlace;
        } else {
          this.errorMsg = 'Formation non trouvée';
        }
      });
    } else {
      this.errorMsg = 'ID formation non spécifié';
    }
  }

  onSubmit() {
    if (!this.formation) return;

    const token = this.authService.getToken();
    if (!token) {
      this.errorMsg = 'Token d\'authentification manquant';
      return;
    }

    const updates: Partial<Formation> = {
      titre: this.titre,
      domaine: this.domaine,
      description: this.description,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      minPlace: this.minPlace,
      maxPlace: this.maxPlace
    };

    this.formationService.updateFormation(this.formation.id, updates, token).subscribe({
      next: () => {
        alert('Formation mise à jour avec succès');
        this.router.navigate(['/formations']);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Erreur lors de la mise à jour';
      }
    });
  }
}
