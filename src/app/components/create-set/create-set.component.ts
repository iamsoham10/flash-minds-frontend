import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCardService } from '../../services/add-card.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-set',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './create-set.component.html',
  styleUrl: './create-set.component.css'
})
export class CreateSetComponent implements OnInit {
  cards: FormGroup[] = [];
  createSetForm!: FormGroup;

  constructor(private addSetService: AddCardService, private router: Router) { }

  ngOnInit(): void {
    this.createSetForm = new FormGroup({
      subject: new FormControl('', Validators.required),
      cards: new FormArray([])
    });
  }
  addCard() {
    const subjectName = this.createSetForm.get('subject')?.value;
    const card = new FormGroup({
      subject: new FormControl(subjectName),
      term: new FormControl('', Validators.required),
      definition: new FormControl('', Validators.required)
    });
    (this.createSetForm.get('cards') as FormArray<FormGroup>).push(card);
    this.cards.push(card);
  }

  removeCard(index: number) {
    (this.createSetForm.get('cards') as FormArray).removeAt(index);
    this.cards.splice(index, 1);
  }

  isSetSaved = false;
  showCardWarining = false;
  saveSet() {
    if (this.createSetForm.valid && this.cards.length > 0) {
      this.isSetSaved = true;
      this.showCardWarining = false;
      this.addSetService.addSet(this.createSetForm.value).subscribe(
        (response) => {
          this.isSetSaved = false;
          alert("set created successfully");
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 200);
        },
        (error) => {
          this.isSetSaved = false;
          this.showCardWarining = false;
          console.error("error saving set:", error);
        }
      )
    } else {
      this.showCardWarining = true;
    }
  }
}
