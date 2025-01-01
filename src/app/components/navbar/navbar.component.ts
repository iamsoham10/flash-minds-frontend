import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StreakService } from '../../services/streak.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }
  streakService = inject(StreakService);
  token = localStorage.getItem('jwttoken');
  decodedToken: any = this.token?.toString() && jwtDecode(this.token);
  user_id = this.decodedToken.user_id;
  streak = this.streakService.getStreakSignal(this.user_id);
  logOutUser() {
    localStorage.removeItem('jwttoken');
    this.router.navigate(['/auth']);
  }
  isMenuOpened: boolean = false;
  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
