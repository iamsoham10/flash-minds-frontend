import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddCardService {

  constructor(private http: HttpClient) { }
  addCardAPI = "http://localhost:3000/api/cards/addcard";

  addSet(cards: object): Observable<object> {
    return this.http.post(this.addCardAPI, cards);
  }
}
