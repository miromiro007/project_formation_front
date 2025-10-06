import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private  http: HttpClient) {}

// Récupérer profils filtrés (admin)
  getProfiles(filters?: { role?: string; nom?: string; email?: string }): Observable<User[]> {
    let params = new HttpParams();
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.nom) params = params.set('nom', filters.nom);
    if (filters?.email) params = params.set('email', filters.email);

    return this.http.get<User[]>(`${this.baseUrl}/user/profile`, { params });
  }


  // Modifier profil utilisateur
  updateUser(userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/userUpdate/${userId}`, data);
  }

  // Valider changement d'email
  validateEmailChange(email: string, code: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/userUpdate/validate-email`, { email, code });
  }

  // Changer statut utilisateur (admin)
  changeUserStatus(userId: string, statut: 'actif' | 'inactif'): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/userUpdate/change-status/${userId}`, { statut });
  }

  // Supprimer utilisateur (admin)
  deleteUser(userId: string, ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/user/delete/${userId}`);
  }
}

