import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  hasError(control: AbstractControl | null, errorType: string): boolean {
    if (!control) {
      return false;
    }

    return !!control.errors?.[errorType] && (control.dirty || control.touched);
  }

  getErrorMessage(control: AbstractControl | null, errorType?: string): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors as ValidationErrors;
    const key = errorType ?? Object.keys(errors)[0];

    if (!key) {
      return '';
    }

    switch (key) {
      case 'required':
        return 'Ce champ est requis.';
      case 'email':
        return 'Format email invalide.';
      case 'minlength':
        return `Minimum ${errors[key]?.requiredLength ?? ''} caracteres.`.trim();
      case 'maxlength':
        return `Maximum ${errors[key]?.requiredLength ?? ''} caracteres.`.trim();
      case 'min':
        return `Valeur minimale: ${errors[key]?.min ?? ''}.`.trim();
      case 'max':
        return `Valeur maximale: ${errors[key]?.max ?? ''}.`.trim();
      case 'pattern':
        return 'Format invalide.';
      case 'passwordStrength':
        return 'Le mot de passe doit contenir majuscule, minuscule, chiffre, caractere special et 8 caracteres minimum.';
      case 'passwordMismatch':
      case 'mustMatch':
        return 'Les mots de passe ne correspondent pas.';
      case 'emailExists':
        return 'Cet email existe deja.';
      default:
        return 'Champ invalide.';
    }
  }
}
