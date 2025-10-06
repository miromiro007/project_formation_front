import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient) {}

  // Ajout d'une réservation (employé)
  addReservation(formationId: string, token: string): Observable<{ message: string; reservation: Reservation }> {
    const headers = new HttpHeaders({ 'x-access-token': token });
    const body = { formation: formationId };
    return this.http.post<{ message: string; reservation: Reservation }>(this.apiUrl, body, { headers });
  }

  // Mise à jour du statut d'une réservation (admin)
  updateStatus(
    id: string,
    status: 'en_attente' | 'confirmee' | 'annulee',
    token: string
  ): Observable<{ message: string; reservation: Reservation }> {
    const headers = new HttpHeaders({ 'x-access-token': token });
    const body = { status };
    return this.http.put<{ message: string; reservation: Reservation }>(`${this.apiUrl}/${id}`, body, { headers });
  }

  // Récupérer toutes les réservations, avec filtres optionnels (admin)
  getReservations(
    token: string,
    filters?: { employeId?: string; formationId?: string }
  ): Observable<Reservation[]> {
    const headers = new HttpHeaders({ 'x-access-token': token });
    let params = new HttpParams();
    if (filters) {
      if (filters.employeId) {
        params = params.set('employeId', filters.employeId);
      }
      if (filters.formationId) {
        params = params.set('formationId', filters.formationId);
      }
    }
    return this.http.get<Reservation[]>(this.apiUrl, { headers, params });
  }

  // Supprimer une réservation (public, option email pour validation)
  deleteReservation(id: string, email?: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/public/${id}`;
    const options = email ? { body: { email } } : {};
    return this.http.delete<{ message: string }>(url, options);
  }

  /** Récupérer la liste des réservations de l’employé authentifié */
  getEmployeReservations(): Observable<Reservation[]> {
    // Pas besoin de token ici, puisque TokenInterceptor l'ajoute automatiquement
    return this.http.get<Reservation[]>(`${this.apiUrl}/employe`);
  }


}
