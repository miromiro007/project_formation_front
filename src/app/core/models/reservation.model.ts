// src/app/core/models/reservation.model.ts
export interface Reservation {
  _id: string;
  formation: {
    _id: string;
    titre: string;
    placeDispo?: number;
  };
  employe: {
    _id: string;
    nom: string;
    email: string;
  };
  status: 'en_attente' | 'confirmee' | 'annulee';
  dateReservation: string; // ISO string format (e.g., "2025-09-29T14:18:00.000Z")
  createdAt: string;
  updatedAt: string;
}
