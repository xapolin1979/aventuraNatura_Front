import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  url = "http://localhost:3001/events";
  
  constructor(private http: HttpClient) { }
 
    getEvent(): Observable<any> {
      return this.http.get<any>(this.url);
   }

  
  getEventId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

 
  createEvent(evento: any): Observable<any> {
    return this.http.post<any>(this.url, evento);
  }

 
  updateEvent(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, evento);
  }

  
  deleteEvent(id?: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
