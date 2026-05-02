import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import {
  emailExistsValidator,
  matchPasswordValidator,
  passwordStrengthValidator,
} from '../../validators/custom-validators';
import { ValidationService } from '../../services/validation.service';
import { ShowErrorDirective } from '../../directives/show-error.directive';

@Component({
  selector: 'app-forms-validators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './forms-validators.html',
  styleUrl: './forms-validators.css',
})
export class FormsValidators implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  readonly validationService = inject(ValidationService);

  accountForm!: FormGroup;

  ngOnInit(): void {
    this.accountForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email],
          [emailExistsValidator(this.userService)],
        ],
        password: ['', [Validators.required, passwordStrengthValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordValidator('password', 'confirmPassword')],
      }
    );
  }

  get email(): FormControl | null {
    return this.accountForm.get('email') as FormControl | null;
  }

  get password(): FormControl | null {
    return this.accountForm.get('password') as FormControl | null;
  }

  get confirmPassword(): FormControl | null {
    return this.accountForm.get('confirmPassword') as FormControl | null;
  }

  submitForm(): void {
    this.accountForm.markAllAsTouched();

    if (this.accountForm.invalid) {
      return;
    }

    console.log('Validators form value:', this.accountForm.value);
  }
}
