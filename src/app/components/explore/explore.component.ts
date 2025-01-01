import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { GetCardService } from '../../services/get-card.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  ngOnInit(): void {
    this.getAllCards();
  }
  constructor(private getCardService: GetCardService, private router: Router) { }
  cardList: any[] = [];
  categorizedSubjects: { [key: string]: string[] } = {};
  getAllCards() {
    const token = localStorage.getItem('jwttoken');
    const decodedToken: any = token?.toString() && jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('jwttoken');
      this.router.navigate(['/auth']);
    }
    const user_id = decodedToken.user_id;
    this.getCardService.getExploreCards().subscribe({
      next: (data) => {
        this.cardList = data.cards;
        console.log('cards fetched successfully', this.cardList);
        this.categorizedSubjects = this.groupSubjectsByCategory(this.cardList);
      },
      error: (err) => {
        console.log('error fetching', err);
      }
    })
  }

  private getCategoryMapping(): { [key: string]: string[] } {
    return {
      Engineering: ["Electrical Engineering", "Chemical Engineering", 'Computer Engineering', 'Mechanical Engineering', 'Civil Engineering'],
      Languages: ["English", 'French', 'German', 'Russian', 'Japanese'],
      Business: ['Marketing', 'Management', 'Supply Chain', 'Finance', 'Accounting'],
    }
  }

  private groupSubjectsByCategory(cardList: any[]): { [key: string]: string[] } {
    const categoryMapping = this.getCategoryMapping();
    const uniqueSubjects = this.getUniqueSubjects(cardList);
    const categorizedSubjects: { [key: string]: string[] } = {};
    Object.keys(categoryMapping).forEach((category) => {
      categorizedSubjects[category] = uniqueSubjects.filter((subject) =>
        categoryMapping[category].includes(subject)
      );
    });
    return categorizedSubjects;
  }

  get categories(): string[] {
    return Object.keys(this.categorizedSubjects);
  }

  getUniqueSubjects(cardList: any[]): string[] {
    return [...new Set(cardList.map(card => card.subject))];
  }
}
