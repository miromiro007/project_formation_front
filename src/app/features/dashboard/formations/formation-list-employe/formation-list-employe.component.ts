import { Component , OnInit} from '@angular/core';
import { Formation } from 'src/app/core/models/formation.model';
import { FormationService } from 'src/app/core/services/formation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-formation-list-employe',
  templateUrl: './formation-list-employe.component.html',
  styleUrls: ['./formation-list-employe.component.css']
})
export class FormationListEmployeComponent implements OnInit {
  formations: Formation[] = [];
  selectedFormation: Formation | null = null;
  reservationMessage: string = '';
  errorMessage: string = '';
  filterForm: FormGroup;
  token: string | null = null;

  constructor(
    private formationService: FormationService,
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      titre: [''],
      domaine: [''],
      placeDispo: ['']
    });
  }

  ngOnInit(): void {
  const savedFilters = localStorage.getItem('formationFilters');
  if (savedFilters) {
    try {
      this.filterForm.patchValue(JSON.parse(savedFilters));
    } catch {}
  }
  this.token = this.authService.getToken();
  this.loadFormations(this.filterForm.value);

  this.filterForm.valueChanges.subscribe(value => {
    localStorage.setItem('formationFilters', JSON.stringify(value));
  });
}

  loadFormations(filters?: any): void {
    this.formationService.getFormations(filters).subscribe({
      next: data => {
        this.formations = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des formations';
      }
    });
  }

  onFilter(): void {
    const filters = this.filterForm.value;

    // Supprimer les filtres vides
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    this.loadFormations(filters);
  }

  toggleDetails(formation: Formation): void {
    this.selectedFormation = this.selectedFormation === formation ? null : formation;
    this.reservationMessage = '';
  }

  closeDetails(): void {
    this.selectedFormation = null;
    this.reservationMessage = '';
  }

  onReserve(formation: Formation): void {
    if (!this.token) {
      this.reservationMessage = 'Vous devez être connecté pour réserver.';
      return;
    }
    this.reservationService.addReservation(formation._id, this.token).subscribe({
      next: resp => {
        this.reservationMessage = resp.message;
        this.loadFormations(); // Met à jour les places disponibles
        this.selectedFormation = null; // Ferme le panneau de détails
      },
      error: err => {
        this.reservationMessage = err.error?.message || 'Erreur lors de la réservation';
      }
    });
  }
}
