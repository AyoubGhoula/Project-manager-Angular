import { AbstractControl, AsyncValidatorFn, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;

    if (!value) {
      return null;
    }

    const checks = {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(value),
      hasMinLength: value.length >= 8,
    };

    const isValid = Object.values(checks).every(Boolean);

    return isValid
      ? null
      : {
          passwordStrength: checks,
        };
  };
}

export function matchPasswordValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(passwordControlName);
    const confirmPasswordControl = control.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (!passwordControl.value || !confirmPasswordControl.value) {
      return null;
    }

    return passwordControl.value === confirmPasswordControl.value
      ? null
      : { passwordMismatch: true };
  };
}

export function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = String(control.value ?? '').trim();

    if (!email) {
      return of(null);
    }

    return userService.checkEmailExists(email).pipe(
      map((exists) => (exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function minCompetencesValidator(minCount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const competences = control.get('competences');

    if (!(competences instanceof FormArray)) {
      return null;
    }

    const count = competences.length;

    if (count === 0) {
      return null;
    }

    return count >= minCount ? null : { minCompetences: { required: minCount, actual: count } };
  };
}

export function minArrayLengthValidator(
  arrayName: string,
  minCount: number,
  errorKey: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arrayControl = control.get(arrayName);

    if (!(arrayControl instanceof FormArray)) {
      return null;
    }

    const count = arrayControl.length;

    return count >= minCount ? null : { [errorKey]: { required: minCount, actual: count } };
  };
}
