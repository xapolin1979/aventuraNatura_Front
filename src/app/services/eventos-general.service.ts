import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosGeneralService {
  url = "http://localhost:3001/general";
  
  constructor(private http: HttpClient) { }
 
  eventosGeneral(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  getEventoId(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}

