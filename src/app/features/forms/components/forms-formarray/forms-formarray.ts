import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { minCompetencesValidator } from '../../validators/custom-validators';
import { ValidationService } from '../../services/validation.service';
import { ShowErrorDirective } from '../../directives/show-error.directive';

@Component({
  selector: 'app-forms-formarray',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './forms-formarray.html',
  styleUrl: './forms-formarray.css',
})
export class FormsFormArray implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);

  emailsForm!: FormGroup;
  competencesForm!: FormGroup;

  ngOnInit(): void {
    this.emailsForm = this.fb.group({
      emails: this.fb.array([this.createEmailGroup()]),
    });

    this.competencesForm = this.fb.group(
      {
        competences: this.fb.array([this.createCompetenceGroup()]),
      },
      {
        validators: [minCompetencesValidator(3)],
      }
    );
  }

  get emails(): FormArray {
    return this.emailsForm.get('emails') as FormArray;
  }

  get competences(): FormArray {
    return this.competencesForm.get('competences') as FormArray;
  }

  createEmailGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      type: ['perso', [Validators.required]],
    });
  }

  addEmail(): void {
    this.emails.push(this.createEmailGroup());
  }

  removeEmail(index: number): void {
    if (this.emails.length === 1) {
      return;
    }

    this.emails.removeAt(index);
  }

  createCompetenceGroup(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required]],
      niveau: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  addCompetence(): void {
    this.competences.push(this.createCompetenceGroup());
  }

  removeCompetence(index: number): void {
    this.competences.removeAt(index);
  }

  submitEmailsForm(): void {
    this.emailsForm.markAllAsTouched();

    if (this.emailsForm.invalid) {
      return;
    }

    console.log('Emails form value:', this.emailsForm.value);
  }

  submitCompetencesForm(): void {
    this.competencesForm.markAllAsTouched();

    if (this.competencesForm.invalid) {
      return;
    }

    console.log('Competences form value:', this.competencesForm.value);
  }
}
