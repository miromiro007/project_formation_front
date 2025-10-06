import { Component  , OnInit} from '@angular/core';
import { FormBuilder , FormGroup } from '@angular/forms';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  filterForm: FormGroup;
  errorMessage = '';
  selectedReservation: Reservation | null = null;
  statusUpdateLoading = false;

  private localStorageKey = 'reservationFilters';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      employeId: [''],
      formationId: [''],
      statusFilter: ['']
    });
  }

  ngOnInit(): void {
    // Restaurer depuis query params
    this.route.queryParams.subscribe(params => {
      if (params['employeId'] || params['formationId'] || params['statusFilter']) {
        // Si des query params sont présents, on patch le formulaire et stocke en localStorage
        this.filterForm.patchValue({
          employeId: params['employeId'] || '',
          formationId: params['formationId'] || '',
          statusFilter: params['statusFilter'] || ''
        });
        this.saveFiltersToLocalStorage();
      } else {
        // Sinon on restaure depuis localStorage
        this.loadFiltersFromLocalStorage();
      }

      this.loadReservations();

      this.filterForm.get('statusFilter')?.valueChanges.subscribe(() => {
        this.applyStatusFilter();
      });
    });
  }

  loadReservations(): void {
    const token = localStorage.getItem('authToken') || '';
    const filters = this.filterForm.value;

    const filterObj: any = {};
    if (filters.employeId) filterObj.employeId = filters.employeId;
    if (filters.formationId) filterObj.formationId = filters.formationId;

    this.reservationService.getReservations(token, filterObj).subscribe({
      next: (res) => {
        this.reservations = res;
        this.applyStatusFilter();
        this.errorMessage = '';
        this.saveFiltersToLocalStorage();
      },
      error: (err) => {
        if (err.status === 404) {
          this.reservations = [];
          this.filteredReservations = [];
          this.errorMessage = "Aucune réservation trouvée";
        } else {
          this.errorMessage = 'Erreur lors du chargement des réservations';
          console.error(err);
        }
      }
    });
  }

  applyStatusFilter(): void {
    const status = this.filterForm.value.statusFilter;
    if (!status) {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(res => res.status === status);
    }
  }

  onFilter(): void {
    const filters = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
    this.loadReservations();
  }

  saveFiltersToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.filterForm.value));
  }

  loadFiltersFromLocalStorage(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.filterForm.patchValue({
          employeId: parsed.employeId || '',
          formationId: parsed.formationId || '',
          statusFilter: parsed.statusFilter || ''
        });
      } catch {
        // Ignorer si JSON invalide
      }
    }
  }

  showDetails(res: Reservation) {
    this.selectedReservation = res;
  }

  closeDetails() {
    this.selectedReservation = null;
  }

  updateStatus(res: Reservation, newStatus: 'en_attente' | 'confirmee' | 'annulee') {
    const token = localStorage.getItem('authToken') || '';
    this.statusUpdateLoading = true;
    this.reservationService.updateStatus(res._id, newStatus, token).subscribe({
      next: () => {
        this.loadReservations();
        this.closeDetails();
        this.statusUpdateLoading = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du changement de statut";
        this.statusUpdateLoading = false;
      }
    });
  }

  deleteReservation(res: Reservation) {
    if (confirm("Confirmez-vous la suppression de cette réservation ?")) {
      this.reservationService.deleteReservation(res._id, res.employe.email).subscribe({
        next: () => {
          this.loadReservations();
          this.closeDetails();
        },
        error: () => {
          this.errorMessage = "Erreur lors de la suppression";
        }
      });
    }
  }
}
