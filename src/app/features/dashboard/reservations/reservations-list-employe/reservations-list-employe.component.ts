import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/core/models/reservation.model';
import { AuthService } from 'src/app/core/services/auth.service';
import {jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reservations-list-employe',
  templateUrl: './reservations-list-employe.component.html',
  styleUrls: ['./reservations-list-employe.component.css']
})
export class ReservationsListEmployeComponent implements OnInit {

  reservations: Reservation[] = [];
  errorMessage = '';
  selectedReservationQR: Reservation | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour voir vos réservations.';
      return;
    }

    this.reservationService.getEmployeReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.errorMessage = '';
      },
      error: (err) => {
        if (err.status === 404) {
          this.reservations = [];
          this.errorMessage = "Vous n'avez aucune réservation.";
        } else {
          this.errorMessage = 'Erreur lors du chargement des réservations';
        }
      }
    });
  }

  // Ouvrir modale QR
  openQR(reservation: Reservation) {
    this.selectedReservationQR = reservation;
  }

  // Fermer modale QR
  closeQR() {
    this.selectedReservationQR = null;
  }

  // Générer les données du QR (JSON ou string)
  getQRCodeData(reservation: Reservation) {
    return JSON.stringify({
      reservationId: reservation._id,
      formation: reservation.formation.titre,
      employe: reservation.employe.nom,
      date: reservation.dateReservation
    });
  }
}
