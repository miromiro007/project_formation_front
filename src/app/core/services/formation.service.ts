import { Injectable } from '@angular/core';
import { Formation } from '../models/formation.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:3000/api/formations';

  constructor(private http: HttpClient) {}

  // Liste des formations avec possibilité de filtrer via query params
  getFormations(filters?: {
    titre?: string;
    domaine?: string;
    dateDebut?: string;
    dateFin?: string;
    minPlace?: number;
    maxPlace?: number;
  }): Observable<Formation[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<Formation[]>(this.apiUrl, { params });
  }

  // Ajouter une formation (nécessite token admin)
  addFormation(formation: Formation, token: string): Observable<Formation> {
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });
    return this.http.post<Formation>(`${this.apiUrl}/addFormation`, formation, { headers });
  }

  // Modifier une formation (nécessite token admin)
  updateFormation(id: string, updates: Partial<Formation>, token: string): Observable<Formation> {
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json'
    });
    return this.http.put<Formation>(`${this.apiUrl}/updateFormation/${id}`, updates, { headers });
  }

  // Supprimer une formation (nécessite token admin)
  deleteFormation(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-access-token': token
    });
    return this.http.delete(`${this.apiUrl}/deleteFormation/${id}`, { headers });
  }
}
