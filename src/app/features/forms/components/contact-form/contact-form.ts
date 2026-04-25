import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import {
  emailExistsValidator,
  matchPasswordValidator,
  passwordStrengthValidator,
} from '../../validators/custom-validators';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  basicForm!: FormGroup;
  contactForm!: FormGroup;
  accountForm!: FormGroup;

  ngOnInit(): void {
    this.basicForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^0[1-9][0-9]{8}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.accountForm = this.fb.group(
      {
        credentials: this.fb.group({
          email: [
            '',
            [Validators.required, Validators.email],
            [emailExistsValidator(this.userService)],
          ],
          password: ['', [Validators.required, passwordStrengthValidator()]],
          confirmPassword: ['', [Validators.required]],
        }),
        profile: this.fb.group({
          adresse: this.fb.group({
            rue: ['', [Validators.required]],
            ville: ['', [Validators.required]],
            codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
          }),
        }),
        competences: this.fb.array([this.createCompetenceControl()]),
      },
      {
        validators: [matchPasswordValidator('credentials.password', 'credentials.confirmPassword')],
      }
    );
  }

  get emailBasic(): FormControl | null {
    return this.basicForm.get('email') as FormControl | null;
  }

  get nom(): FormControl | null {
    return this.contactForm.get('nom') as FormControl | null;
  }

  get prenom(): FormControl | null {
    return this.contactForm.get('prenom') as FormControl | null;
  }

  get emailContact(): FormControl | null {
    return this.contactForm.get('email') as FormControl | null;
  }

  get telephone(): FormControl | null {
    return this.contactForm.get('telephone') as FormControl | null;
  }

  get message(): FormControl | null {
    return this.contactForm.get('message') as FormControl | null;
  }

  get credentialsGroup(): FormGroup {
    return this.accountForm.get('credentials') as FormGroup;
  }

  get emailAccount(): FormControl {
    return this.credentialsGroup.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.credentialsGroup.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.credentialsGroup.get('confirmPassword') as FormControl;
  }

  get competences(): FormArray {
    return this.accountForm.get('competences') as FormArray;
  }

  createCompetenceControl(): FormControl {
    return this.fb.control('', Validators.required);
  }

  addCompetence(): void {
    this.competences.push(this.createCompetenceControl());
  }

  removeCompetence(index: number): void {
    if (this.competences.length === 1) {
      return;
    }

    this.competences.removeAt(index);
  }

  submitBasicForm(): void {
    this.basicForm.markAllAsTouched();

    if (this.basicForm.invalid) {
      return;
    }

    console.log('Basic form value:', this.basicForm.value);
  }

  submitContactForm(): void {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    console.log('Contact form value:', this.contactForm.value);
  }

  submitAccountForm(): void {
    this.accountForm.markAllAsTouched();

    if (this.accountForm.invalid) {
      return;
    }

    console.log('Account form value:', this.accountForm.value);
  }

  hasError(control: FormControl | null, errorKey: string): boolean {
    if (!control) {
      return false;
    }

    return !!control.errors?.[errorKey] && (control.dirty || control.touched);
  }
}
