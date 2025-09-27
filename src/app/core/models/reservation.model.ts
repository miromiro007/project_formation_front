export interface Reservation {
  id: string;
  user: string;          // ID utilisateur
  formation: string;     // ID formation
  status: 'en_attente' | 'confirmee' | 'annulee';
  dateReservation: string;  // ISO 8601
}
