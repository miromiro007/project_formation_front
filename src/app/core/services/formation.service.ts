import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';


 export interface FormationRequest {
  titre: string;
  description: string;
  domaine: string;
  competenceVisee: string[];
  dateDebut: string; // format ISO string
  dateFin: string;
  placeDispo: number;
  numeroSalle: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private apiUrl = 'http://localhost:3000/api/formations';

  constructor(private http: HttpClient) {}

  // Récupérer la liste des formations avec filtres optionnels
   getFormations(filters?: {
    titre?: string;
    domaine?: string;
    dateDebut?: Date;
    dateFin?: Date;
    placeDispo?: number;
    numeroSalle?: string;
    competenceVisee?: string;
  }): Observable<Formation[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<Formation[]>(this.apiUrl, { params });
  }

  //Get Formation par id
getFormation(id: string): Observable<Formation> {
  return this.http.get<Formation>(`${this.apiUrl}/formations/${id}`);
}
  // Ajouter une formation (admin)
  addFormation(formation: FormationRequest, token: string): Observable<any> {
  const headers = new HttpHeaders({ 'x-access-token': token });
  return this.http.post(`${this.apiUrl}/addFormation`, formation, { headers });
}



  // Modifier une formation par ID (admin)
  updateFormation(id: string, data: Partial<Formation>, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'x-access-token': token });
    return this.http.put(`${this.apiUrl}/updateFormation/${id}`, data, { headers });
  }

  // Supprimer une formation par ID (admin)
  deleteFormation(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'x-access-token': token });
    return this.http.delete(`${this.apiUrl}/deleteFormation/${id}`, { headers });
  }

}
