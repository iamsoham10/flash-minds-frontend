import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  registerAPI: string = "http://localhost:3000/api/users/register";
  logInAPI: string = "http://localhost:3000/api/users/login";
  constructor(private http: HttpClient) { }

  registerUser(user: object): Observable<object> {
    return this.http.post(this.registerAPI, user);
  }

  logUserIn(user: Object): Observable<any> {
    return this.http.post(this.logInAPI, user);
  }
}
