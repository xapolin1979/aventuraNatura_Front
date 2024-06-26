import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  url = "http://localhost:3001/participants";
  constructor(private http: HttpClient) { }

   getParticipantesdelEvento(id: number): Observable<any> {
     return this.http.get<any>(this.url + "/" + id);
   }
   
  inscribirParticipante(evento: any): Observable<any> {
    return this.http.post<any>(this.url, evento);
  }
  actualizarParticipante(id: number, participante: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}`, participante);
  }

  borrarParticipante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
