import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  animations: [
    trigger('floatUpAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ])
    ])
  ]
})
export class SignupComponent {
  constructor(private register: RegisterService, private router: Router) { }
  private formBuilder = inject(FormBuilder);
  isSignUp: boolean = true;

  toggleForm() {
    this.isSignUp = !this.isSignUp
  }


  userSignUpForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
  });

  userLoginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  isLoadingSignUp = false;
  cantSignIn = false;
  saveNewUser() {
    if (this.userSignUpForm.valid) {
      this.isLoadingSignUp = true;
      this.register.registerUser(this.userSignUpForm.value).subscribe(
        (response) => {
          console.log("saved data 😎");
          this.isLoadingSignUp = false;
          this.isSignUp = false;
        },
        (error) => {
          console.error("error saving data 🥹", error);
          this.cantSignIn = true;
          this.isLoadingSignUp = false;
        }
      )
    } else {
      console.warn('Form is invalid');
    }
  }

  isLoadingLogIn = false;
  cantLogIn = false;
  logUser() {
    if (this.userLoginForm.valid) {
      this.isLoadingLogIn = true;
      this.register.logUserIn(this.userLoginForm.value).subscribe(
        (response) => {
          console.log("logged in 😎");
          this.isLoadingLogIn = false;
          localStorage.removeItem('jwttoken');
          localStorage.setItem('jwttoken', response.token);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('error logging in 🥹');
          this.cantLogIn = true;
          this.isLoadingLogIn = false;
        }
      )
    }
  }
}
