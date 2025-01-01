import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetCardService } from '../../services/get-card.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StreakService } from '../../services/streak.service';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css',
  animations: [
    trigger('flipState', [
      state(
        'front',
        style({
          transform: 'rotateY(0deg)',
        })
      ),
      state(
        'back',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      transition('front => back', [animate('500ms ease-out')]),
      transition('back => front', [animate('500ms ease-in')]),
    ]),
  ],

})
export class StudyComponent implements OnInit {
  filteredCardList: any[] = [];
  currentCardIndex = 0;
  subject: string = '';
  quizTestForm!: FormGroup;
  flip: string = 'front';
  streak = { count: 0 };

  constructor(private getCardService: GetCardService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private streakService: StreakService) {
    this.quizTestForm = this.fb.group({
      answers: this.fb.array(
        this.filteredCardList.map(() => this.fb.control('', Validators.required))
      )
    });
  }


  ngOnInit(): void {
    this.getAllCards();
    const token = localStorage.getItem('jwttoken');
    const decodedToken: any = token?.toString() && jwtDecode(token);
    const user_id = decodedToken.user_id;
    this.streak = this.streakService.getUserStreak(user_id);
  }

  // quiz test mode form
  get answers(): FormArray {
    return this.quizTestForm.get('answers') as FormArray<FormControl>;
  }
  initializeForm() {
    this.quizTestForm = this.fb.group({
      answers: this.fb.array(
        this.filteredCardList.map(() => this.fb.control('', Validators.required))
      )
    })
  }

  toggleFlip() {
    this.flip = this.flip === 'front' ? 'back' : 'front';
  }


  nextCard() {
    const token = localStorage.getItem('jwttoken');
    const decodedToken: any = token?.toString() && jwtDecode(token);
    const user_id = decodedToken.user_id;
    this.streakService.markStreak(user_id);
    this.streak = this.streakService.getUserStreak(user_id);
    console.log(this.streak);
    if (this.currentCardIndex < this.cardList.length - 1) {
      this.currentCardIndex++;
    } else if (this.currentCardIndex >= this.cardList.length - 1) {
      this.currentCardIndex = 0;
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
    } else {
      this.currentCardIndex = this.cardList.length;
    }
  }

  cardList: any[] = [];
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
        this.subject = this.route.snapshot.paramMap.get('subject') || '';
        this.filteredCardList = this.cardList.filter(card => card.subject === this.subject);
        console.log('Filtered cards: ', this.filteredCardList);
        this.initializeForm();
      },
      error: (err) => {
        console.log('error fetching', err);
      }
    })
  }

  showTestDiv = false;
  showTestResultDiv = false;
  showCardDiv = true;
  totalTestQuestions = this.filteredCardList.length;
  correctTestAnswers = 0;
  incorrectTestAnswers = 0;
  testPercentage = 0;

  // quiz test mode score calculation
  isResultCalculated = false;
  testResult() {
    this.isResultCalculated = true;
    if (this.quizTestForm.valid) {
      const submittedAnswers = this.quizTestForm.value.answers;
      this.filteredCardList.forEach((card, index) => {
        if (submittedAnswers[index].trim().toLowerCase() === card.definition.trim().toLowerCase()) {
          this.correctTestAnswers++;
        } else {
          this.incorrectTestAnswers++;
        }
      });
      this.totalTestQuestions = this.filteredCardList.length;
      this.testPercentage = parseFloat(((this.correctTestAnswers / this.totalTestQuestions) * 100).toFixed(2));
      this.isResultCalculated = false;
      this.showTestResultDiv = true;
    } else {
      console.log('Please answer all questions');
    }
  }

  showTest() {
    this.showTestDiv = true;
    this.showCardDiv = false;
  }

  // match mode
  showMatchDiv = false;
  matchCards: any[] = [];
  showMatch() {
    console.log(this.filteredCardList);
    this.showMatchDiv = true;
    this.showCardDiv = false;
    this.matchCards = this.getRandomCards(this.filteredCardList);
    console.log("selected random cards: ", this.matchCards);
    this.initializeMatchMode();
    console.log('shuffled studd: ', this.shuffledPairs);
  }

  // this function selects a random element from the array and then shuffles the array and finally returns the shuffled array
  shuffleArray(cardArray: any[]): Array<[]> {
    const shuffledArray = cardArray.slice()
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
  }

  getRandomCards(filteredCardsArray: any) {
    if (filteredCardsArray.length > 6) {
      const shuffled = this.shuffleArray(filteredCardsArray);
      return shuffled.slice(0, 6);
    } else if (filteredCardsArray.length < 6) {
      return filteredCardsArray;
    }
  }

  // function to show terms and definitions randomly on a page
  getShuffledPairs(matchCards: any[]): any[] {
    const pairs = matchCards.flatMap(card => [
      { type: 'term', value: card.term, id: card._id },
      { type: 'definition', value: card.definition, id: card._id }
    ]);
    return this.shuffleArray(pairs);
  }
  shuffledPairs: any[] = []; // Store shuffled pairs

  initializeMatchMode() {
    this.shuffledPairs = this.getShuffledPairs(this.matchCards);
  }
  selectedItems: any[] = []; // Store selected items

  handleSelection(item: any) {
    if (this.selectedItems.length < 2 && !this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
      if (this.selectedItems.length === 2) {
        setTimeout(() => {
          this.checkMatch();
        }, 100);
      }
    }
  }

  checkMatch() {
    const [first, second] = this.selectedItems;

    // Check if the pair is correct
    if (first.id === second.id && first.type !== second.type) {
      alert('Correct Match!');
      // Remove matched items from `shusffledPairs`
      this.shuffledPairs = this.shuffledPairs.filter(
        pair => pair.id !== first.id
      );
      console.log('shuffledPairs after: ', this.shuffledPairs);
    } else {
      alert('Incorrect Match. Try Again.');
    }

    // Clear selection
    this.selectedItems = [];
    if (this.shuffledPairs.length === 0) {
      setTimeout(() => {
        alert("Great! You did it");
        this.showMatchDiv = false;
        this.showCardDiv = true;
      }, 200);
    }
  }


  // practice mode
  showPracticeDiv = false;
  showPractice() {
    this.showPracticeDiv = true;
    this.showCardDiv = false;
    this.filteredCardListSignal.set(this.getFilteredCards());
    this.initializeCardStates();
    console.log('Filtered cards: ', this.filteredCardListSignal());
  }


  initializeCardStates() {
    const filteredCards = this.filteredCardListSignal();
    console.log("cards:", filteredCards);
    filteredCards.forEach(card => {
      this.cardStates.set(card._id, {
        showAnswer: false,
        learned: null,
        showAnswerDiv: false,
        showButtonDiv: false,
        showAnswerButton: true,
      });
    });
  }

  showAnswerDiv = false;
  showButtonDiv = false;
  showAnswerButton = true;

  showAnswer(cardId: string) {
    const state = this.cardStates.get(cardId);
    if (state) {
      state.showAnswer = true;
      state.showAnswerDiv = true;
      state.showButtonDiv = true;
      state.showAnswerButton = false;
    }
  }

  markAsLearned(cardId: string, learned: boolean) {
    const state = this.cardStates.get(cardId);
    if (state) {
      state.learned = learned;
      state.showButtonDiv = false;
      // Check if all cards have been marked
      const allMarked = Array.from(this.cardStates.values()).every(
        cardState => cardState.learned !== null
      );
      // If all cards are marked, calculate the results
      if (allMarked) {
        this.calculateResult();
      }
    }
  }


  calculateResult() {
    let learned = 0;
    let notLearned = 0;
    this.cardStates.forEach(state => {
      if (state.learned === true) learned++;
      if (state.learned === false) notLearned++;
    });
    alert(`Learned: ${learned}, Not learned: ${notLearned}`);
    setTimeout(() => {
      this.showPracticeDiv = false;
      this.showCardDiv = true;
    }, 200);
  }

  showPracticeDivSignal = signal(false);
  filteredCardListSignal = signal(this.filteredCardList || []);
  getFilteredCards() {
    return this.filteredCardList.filter(card => card && card._id);
  }
  cardStates = new Map<string, { showAnswer: boolean; learned: boolean | null; showAnswerButton: boolean; showAnswerDiv: boolean; showButtonDiv: boolean }>();
}
