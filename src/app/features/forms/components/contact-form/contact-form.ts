import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  basicForm!: FormGroup;
  contactForm!: FormGroup;

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
}
