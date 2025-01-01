import { Component, inject, OnInit } from '@angular/core';
import { GetCardService } from '../../services/get-card.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { StreakService } from '../../services/streak.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  cardList: any[] = [];
  filteredCardList: any[] = [];
  CurrentUserName: string = '';
  subject: string = '';
  ngOnInit(): void {
    this.getAllCards();
  }
  constructor(private getCardsService: GetCardService, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }
  streakService = inject(StreakService);
  token = localStorage.getItem('jwttoken');
  decodedToken: any = this.token?.toString() && jwtDecode(this.token);
  user_id = this.decodedToken.user_id;
  streak = this.streakService.getStreakSignal(this.user_id);

  getAllCards() {
    const token = localStorage.getItem('jwttoken');
    const decodedToken: any = token?.toString() && jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('jwttoken');
      this.router.navigate(['/auth']);
    }
    const user_id = decodedToken.user_id;
    this.CurrentUserName = decodedToken.username;
    this.getCardsService.getCards(user_id).subscribe({
      next: (data) => {
        this.cardList = data.cards;
        this.getUniqueSubjects(this.cardList);
        this.subject = this.route.snapshot.paramMap.get('subject') || '';
        this.filteredCardList = this.cardList.filter(card => card.username === this.CurrentUserName);
        console.log('Filtered cards: ', this.filteredCardList);
      },
      error: (err) => {
        console.log('error fetching', err);
      }
    })
  }

  getUniqueSubjects(cardList: any[]): string[] {
    const values = [...new Set(cardList.map(card => card.subject))];
    return values;
  }

  getCardCountBySubject(subject: string) {
    return this.cardList.filter(card => card.subject === subject).length;
  }

  isMenuOpened: boolean = false;
  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }


}
