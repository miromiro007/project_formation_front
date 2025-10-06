import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';  // Correction d'importation pour jwt-decode

interface LoginResponse {
  message: string;
  token: string;
  user: any;
}

interface LogoutResponse {
  message: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private baseUrl = 'http://localhost:3000';
  private tokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private loadingUserSubject = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  isLoadingUser(): Observable<boolean> {
    return this.loadingUserSubject.asObservable();
  }

  private loadUserFromToken() {
  this.loadingUserSubject.next(true);
  const token = this.getToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;

      if (exp && Date.now() < exp * 1000) {
        // Extraction correcte des données utilisateur du token
        const userData = decoded.user || {
          id: decoded.id,
          email: decoded.email,
          nom: decoded.nom,
          role: decoded.role
        };
        this.currentUserSubject.next(userData);
      } else {
        this.logoutLocal();
      }
    } catch {
      this.logoutLocal();
    }
  }
  this.loadingUserSubject.next(false);
}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/userLogin/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): Observable<LogoutResponse> {
    const token = this.getToken();
    if (!token) {
      this.logoutLocal();
      return of({ message: 'Déconnexion réussie', user: null });
    }

    const headers = new HttpHeaders({
      'x-access-token': token
    });

    return this.http.post<LogoutResponse>(`${this.apiUrl}/userLogin/logout`, {}, { headers }).pipe(
      tap(() => this.logoutLocal()),
      catchError(() => {
        this.logoutLocal();
        return of({ message: 'Déconnexion réussie', user: null });
      })
    );
  }

  public logoutLocal() {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      return exp ? (Date.now() < exp * 1000) : true;
    } catch {
      return false;
    }
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  register(userData: { nom: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/userRegister/register`, userData);
  }

  validateResetCode(data: { email: string; code: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-code`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(data: { email: string; code: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, data);
  }

  validateCode(data: { email: string; code: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/validate-code`, data);
  }
  //valider email Code

  validateEmailCode(email: string, code: string): Observable<{ message: string }> {
  return this.http.post<{ message: string }>(`${this.apiUrl}/userUpdate/validate-email`, { email, code });
}


 getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }
  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return user && user.role === role;
  }

  // Vérifier si l'utilisateur est authentifié ET a un token valide
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const user = decoded.user || {
        id: decoded.id,
        email: decoded.email,
        nom: decoded.nom,
        role: decoded.role
      };

      // Mettre à jour l'utilisateur courant
      this.currentUserSubject.next(user);

      return true;
    } catch {
      this.logoutLocal();
      return false;
    }
  }

updateProfile(data: { email?: string; oldPassword: string; newPassword?: string }): Observable<any> {
  const userId = this.getCurrentUserValue()?._id || this.getCurrentUserValue()?.id;
  if (!userId) {
    throw new Error('Utilisateur non connecté');
  }

  const payload: any = {
    oldPassword: data.oldPassword,
  };

  if (data.email) {
    payload.email = data.email; // Nouveau mail si changé
  }
  if (data.newPassword) {
    payload.password = data.newPassword; // Nouveau mot de passe facultatif
  }
  return this.http.put<any>(`${this.apiUrl}/userUpdate/${userId}`, payload);
}
}
