import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   url = 'http://localhost:3001/auth';
  localStorageKey = 'token';
  isAuthenticated: boolean = false;

  constructor(public http: HttpClient) { }

  registrarUsuario(registroData: any): Observable<any> {
    return this.http.post(`${this.url}/register`, registroData);
  }

  loginUsuario(loginData: any): Observable<any> {
    return this.http.post(`${this.url}/login`, loginData).pipe(
      tap((response: any) => {
        localStorage.setItem(this.localStorageKey, response.token);
        this.isAuthenticated = true;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.url}/logout`).pipe(
      tap((response: any) => {
        localStorage.removeItem(this.localStorageKey);
        this.isAuthenticated = false;
      })
    );
  }

  isLoggedIn(): boolean {
   
    return !!localStorage.getItem(this.localStorageKey);
  }


  
}
