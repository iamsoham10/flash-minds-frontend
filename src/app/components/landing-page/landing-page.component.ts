import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  animations: [
    trigger('floatUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('1s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LandingPageComponent {
  isMenuOpened: boolean = false;
  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
  navLinks = [
    { label: 'Explore', path: '#explore' },
    { label: 'My Cards', path: '/dashboard' }
  ];

  heroButtons = [
    { label: 'Make a card', path: '/create-set' },
    { label: 'Learn', path: '/dashboard' }
  ];

  features = [
    { icon: 'fas fa-book', iconColor: 'text-purple-500', title: 'Custom Flashcards', description: 'Create flashcards tailored to your learning needs.' },
    { icon: 'fas fa-brain', iconColor: 'text-blue-500', title: 'Study Modes', description: 'Interactive tools like Quiz and Spaced Repetition.' },
    { icon: 'fas fa-fire', iconColor: 'text-red-500', title: 'Stay Motivated', description: 'Track your streaks and achieve your learning goals.' }
  ];

  exploreCards = [
    { title: 'Computer Engineering', count: 29, initial: 'J', author: 'John Doe' },
    { title: 'English', count: 21, initial: 'G', author: 'George Doe' },
    { title: 'Data Link Layer', count: 112, initial: 'J', author: 'Jane Doe' }
  ];

  studyModes = [
    { icon: 'fas fa-brain', iconColor: 'text-purple-500', title: 'Quiz Mode', description: 'Test your knowledge with interactive quizzes. Perfect for quick reviews and focused learning.' },
    { icon: 'fas fa-history', iconColor: 'text-blue-500', title: 'Practice Mode', description: 'Strengthen your understanding by actively engaging with terms and definitions. Mark your progress as you learn with instant feedback.' },
    { icon: 'fas fa-columns', iconColor: 'text-red-500', title: 'Match Mode', description: 'Match terms with their definitions in a timed challenge. A fun and fast-paced way to learn.' }
  ];
}
