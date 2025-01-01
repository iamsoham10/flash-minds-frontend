import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCardService {
  private cardCache: any[] | null = null;
  getCardsAPI = "http://localhost:3000/api/cards/readcard";
  exploreCardsAPI = "http://localhost:3000/api/cards/readcard?user_id=320dbb16-ca93-47e2-8388-734db51fa750";
  constructor(private http: HttpClient) { }

  getCards(user_id: string): Observable<any> {
    if (this.cardCache) {
      console.log('returning cached card data');
      return of({ cards: this.cardCache });
    }
    return this.http.get(`${this.getCardsAPI}`, { params: new HttpParams().set('user_id', user_id) })
      .pipe(tap((response: any) => {
        this.cardCache = response.cards;
      }));
  }

  private exploreCardCache: any[] | null = null;
  getExploreCards(): Observable<any> {
    if (this.exploreCardCache) {
      console.log('returning cached explore card data');
      return of({ cards: this.exploreCardCache });
    }
    return this.http.get(this.exploreCardsAPI).pipe(
      tap((response: any) => {
        this.exploreCardCache = response.cards;
      })
    );
  }
  clearCache() {
    this.cardCache = null;
  }
}
