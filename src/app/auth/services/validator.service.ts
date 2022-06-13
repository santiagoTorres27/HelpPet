import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  public emailRegexValidation: string =
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  equalPasswords(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(field1)?.value;
      const password2 = formGroup.get(field2)?.value;

      if (password !== password2) {
        formGroup.get(field2)?.setErrors({ passwordsNotMatch: true });
        return { passwordsNotMatch: true };
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    };
  }

  constructor() {}
}
