import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  url = "http://localhost:3001/photos";
  
  constructor(private http: HttpClient) { }
  insertPhotos(id: number,photos:any): Observable<any> {
    return this.http.post<any>(`${this.url}/${id}`, photos);
  }

  verFotosUsuario(): Observable<any> {
    return this.http.get<any>(this.url);
  }

 verFotosEvento(id:number):Observable<any>{
  return this.http.get<any>(`${this.url}/${id}`);
}


deletePhoto(id: number): Observable<any> {
  return this.http.delete<any>(`${this.url}/${id}`);
}



}


