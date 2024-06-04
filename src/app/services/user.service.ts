import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = "http://localhost:3001/user";
  
  constructor(public http: HttpClient) { }
 
  getUser(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
