import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../../forms/services/validation.service';
import { ShowErrorDirective } from '../../../forms/directives/show-error.directive';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  contactForm!: FormGroup;
  successMessage = '';

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      sujet: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get nom(): FormControl | null {
    return this.contactForm.get('nom') as FormControl | null;
  }

  get email(): FormControl | null {
    return this.contactForm.get('email') as FormControl | null;
  }

  get sujet(): FormControl | null {
    return this.contactForm.get('sujet') as FormControl | null;
  }

  get message(): FormControl | null {
    return this.contactForm.get('message') as FormControl | null;
  }

  submitForm(): void {
    this.contactForm.markAllAsTouched();
    this.successMessage = '';

    if (this.contactForm.invalid) {
      return;
    }

    console.log('Contact payload:', this.contactForm.value);
    this.successMessage = 'Votre message a ete envoye avec succes.';
    this.contactForm.reset();
  }
}
