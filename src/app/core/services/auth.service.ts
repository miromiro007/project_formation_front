import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

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
  private currentUserSubject = new BehaviorSubject<any>(null)

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

 private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp;
        if (exp && Date.now() < exp * 1000) {
          // Vérifie la clé où sont stockées les infos utilisateur dans ton token
          const user = decoded.user || decoded.sub || null;
          this.currentUserSubject.next(user);
        } else {
          this.logoutLocal();
        }
      } catch {
        this.logoutLocal();
      }
    }
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

  private logoutLocal() {
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

validateCode(data: { email: string; code: string }): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/validate-code`, data);
}

resetPassword(data: { email: string; code: string; password: string; confirmPassword: string }): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/reset-password`, data);
}

}
