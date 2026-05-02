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
import { minArrayLengthValidator } from '../../validators/custom-validators';
import { ValidationService } from '../../services/validation.service';
import { ShowErrorDirective } from '../../directives/show-error.directive';

@Component({
  selector: 'app-forms-nested',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './forms-nested.html',
  styleUrl: './forms-nested.css',
})
export class FormsNested implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  userForm!: FormGroup;
  addressesForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      adresse: this.fb.group({
        rue: ['', [Validators.required]],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', [Validators.required]],
        pays: ['', [Validators.required]],
      }),
    });

    this.addressesForm = this.fb.group(
      {
        addresses: this.fb.array([this.createAddressGroup()]),
      },
      {
        validators: [minArrayLengthValidator('addresses', 1, 'minAddresses')],
      }
    );
  }

  get adresseGroup(): FormGroup {
    return this.userForm.get('adresse') as FormGroup;
  }

  get addresses(): FormArray {
    return this.addressesForm.get('addresses') as FormArray;
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

  createAddressGroup(): FormGroup {
    return this.fb.group({
      type: ['domicile', [Validators.required]],
      rue: ['', [Validators.required]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ville: ['', [Validators.required]],
    });
  }

  addAddress(): void {
    this.addresses.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  submitUserForm(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    console.log('Nested user form value:', this.userForm.value);
  }

  submitAddressesForm(): void {
    this.addressesForm.markAllAsTouched();

    if (this.addressesForm.invalid) {
      return;
    }

    console.log('Addresses form value:', this.addressesForm.value);
  }
}
