import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ValidatorService } from '../services/validator.service';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { User } from '../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  myauth = getAuth();

  signupForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.validatorService.emailRegexValidation),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      password2: new FormControl(null, [Validators.required]),
    },
    {
      validators: [
        this.validatorService.equalPasswords('password', 'password2'),
      ],
    }
  );

  //Getter for email validation
  get emailErrorMsg(): string {
    const errors = this.signupForm.get('email')?.errors;
    if (errors?.['required']) {
      return 'El email es obligatorio';
    } else if (errors?.['pattern']) {
      return 'El formato de email es incorrecto';
    }
    return '';
  }

  //Getter for password validation
  get passwordErrorMsg(): string {
    const errors = this.signupForm.get('password')?.errors;
    if (errors?.['required']) {
      return 'La contraseña es obligatoria';
    } else if (errors?.['minlength']) {
      return 'La contraseña debe ser de al menos 6 caracteres';
    }
    return '';
  }

  constructor(
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  submitForm() {
    if (this.signupForm.valid) {
      // Authentication
      const { name, lastname, email, password } = this.signupForm.value;

      this.authService
        .register({ email, password })
        .then(() => {
          // Add new user
          onAuthStateChanged(this.myauth, (user) => {
            if (user) {
              const uid = user.uid;
              const userAdded: User = { uid: uid, name, lastname, email };
              this.userService.addUser(userAdded);

              localStorage.setItem('userId', user.uid);
              this.authService.sendUserId();
            }
          });

          // Navigate to home page
          this.router.navigateByUrl('/pets');
        })
        .catch((err) => {
          switch (err.code) {
            case 'auth/email-already-in-use':
              Swal.fire({
                icon: 'error',
                text: 'Ya existe un usuario con el email ingresado',
              });
              break;
          }
        });
    } else {
      console.log('Formulario inválido');
    }
  }
}
