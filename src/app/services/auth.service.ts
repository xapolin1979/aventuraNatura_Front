import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3001/auth';

  constructor(private http: HttpClient) {
    this.isAuthenticated = !!localStorage.getItem('isAuthenticated');
  }

  registrarUsuario(registroData: any): Observable<any> {
    return this.http.post(`${this.url}/register`, registroData);
  }

  loginUsuario(loginData: any): Observable<any> {
    return this.http.post(`${this.url}/login`, loginData).pipe(
      tap(() => {
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticated = true;
      })
    );
  }

  closeSesion(): Observable<any> {
    return this.http.get(`${this.url}/logout`).pipe(
      tap(() => {
        localStorage.removeItem('isAuthenticated');
        this.isAuthenticated = false;
      })
    );
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('isAuthenticated');
  }

  set isAuthenticated(value: boolean) {
    if (value) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated = false;
  }
}
