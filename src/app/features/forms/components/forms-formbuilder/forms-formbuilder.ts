import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { ShowErrorDirective } from '../../directives/show-error.directive';

@Component({
  selector: 'app-forms-formbuilder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './forms-formbuilder.html',
  styleUrl: './forms-formbuilder.css',
})
export class FormsFormBuilder implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      ville: ['', [Validators.required]],
    });
  }

  get nom(): FormControl | null {
    return this.userForm.get('nom') as FormControl | null;
  }

  get prenom(): FormControl | null {
    return this.userForm.get('prenom') as FormControl | null;
  }

  get email(): FormControl | null {
    return this.userForm.get('email') as FormControl | null;
  }

  get age(): FormControl | null {
    return this.userForm.get('age') as FormControl | null;
  }

  get ville(): FormControl | null {
    return this.userForm.get('ville') as FormControl | null;
  }

  markFormGroupTouched(control: AbstractControl | null): void {
    if (!control) {
      return;
    }

    control.markAsTouched();

    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach((child) => this.markFormGroupTouched(child));
    }
  }

  resetForm(): void {
    this.userForm.reset();
  }

  submitForm(): void {
    this.markFormGroupTouched(this.userForm);

    if (this.userForm.invalid) {
      return;
    }

    console.log('FormBuilder form value:', this.userForm.value);
  }
}
