import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { matchPasswordValidator, passwordStrengthValidator } from '../../validators/custom-validators';
import { ValidationService } from '../../services/validation.service';
import { ShowErrorDirective } from '../../directives/show-error.directive';

@Component({
  selector: 'app-forms-errors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './forms-errors.html',
  styleUrl: './forms-errors.css',
})
export class FormsErrors implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  demoForm!: FormGroup;

  ngOnInit(): void {
    this.demoForm = this.fb.group(
      {
        nom: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
        password: ['', [Validators.required, passwordStrengthValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordValidator('password', 'confirmPassword')],
      }
    );
  }

  get nom(): FormControl | null {
    return this.demoForm.get('nom') as FormControl | null;
  }

  get email(): FormControl | null {
    return this.demoForm.get('email') as FormControl | null;
  }

  get age(): FormControl | null {
    return this.demoForm.get('age') as FormControl | null;
  }

  get password(): FormControl | null {
    return this.demoForm.get('password') as FormControl | null;
  }

  get confirmPassword(): FormControl | null {
    return this.demoForm.get('confirmPassword') as FormControl | null;
  }

  submitForm(): void {
    this.demoForm.markAllAsTouched();

    if (this.demoForm.invalid) {
      return;
    }

    console.log('Errors demo form value:', this.demoForm.value);
  }

  resetForm(): void {
    this.demoForm.reset();
  }
}
