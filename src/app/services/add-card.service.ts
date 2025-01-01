import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddCardService {

  constructor(private http: HttpClient) { }
  addCardAPI = "https://flash-minds-backend.onrender.com/api/cards/addcard";

  addSet(cards: object): Observable<object> {
    return this.http.post(this.addCardAPI, cards);
  }
}
