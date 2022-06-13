import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.validatorService.emailRegexValidation),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  //Getter for email validation
  get emailErrorMsg(): string {
    const errors = this.loginForm.get('email')?.errors;
    if (errors?.['required']) {
      return 'El email es obligatorio';
    } else if (errors?.['pattern']) {
      return 'El formato de email es incorrecto';
    }
    return '';
  }

  //Getter for password validation
  get passwordErrorMsg(): string {
    const errors = this.loginForm.get('password')?.errors;
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
    private router: Router
  ) {}

  ngOnInit(): void {}

  submitForm() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login({ email, password })
        .then((res) => {
          this.router.navigateByUrl('/pets');

          localStorage.setItem('userId', res.user.uid);
          this.authService.sendUserId();
        })
        .catch((err) => {
          switch (err.code) {
            case 'auth/wrong-password':
              Swal.fire({
                icon: 'error',
                text: 'La contraseña es incorrecta',
              });
              break;

            case 'auth/user-not-found':
              Swal.fire({
                icon: 'error',
                text: 'No se ha encontrado ningún usuario con el email ingresado',
              });
              break;
          }
        });
    } else {
      console.log('Formulario inválido');
    }
  }
}
