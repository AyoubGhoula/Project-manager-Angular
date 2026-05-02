import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import {
  emailExistsValidator,
  matchPasswordValidator,
  passwordStrengthValidator,
} from '../../../forms/validators/custom-validators';
import { ValidationService } from '../../../forms/services/validation.service';
import { ShowErrorDirective } from '../../../forms/directives/show-error.directive';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ShowErrorDirective],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.css',
})
export class AuthRegister implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  readonly validationService = inject(ValidationService);

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nom: ['', [Validators.required, Validators.minLength(2)]],
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        email: [
          '',
          [Validators.required, Validators.email],
          [emailExistsValidator(this.userService)],
        ],
        role: ['utilisateur', [Validators.required]],
        password: ['', [Validators.required, passwordStrengthValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordValidator('password', 'confirmPassword')],
      }
    );
  }

  get nom(): FormControl | null {
    return this.registerForm.get('nom') as FormControl | null;
  }

  get prenom(): FormControl | null {
    return this.registerForm.get('prenom') as FormControl | null;
  }

  get email(): FormControl | null {
    return this.registerForm.get('email') as FormControl | null;
  }

  get role(): FormControl | null {
    return this.registerForm.get('role') as FormControl | null;
  }

  get password(): FormControl | null {
    return this.registerForm.get('password') as FormControl | null;
  }

  get confirmPassword(): FormControl | null {
    return this.registerForm.get('confirmPassword') as FormControl | null;
  }

  submitForm(): void {
    this.registerForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const { nom, prenom, email, role, password } = this.registerForm.value as {
      nom: string;
      prenom: string;
      email: string;
      role: string;
      password: string;
    };

    this.isLoading = true;

    this.authService.register({ nom, prenom, email, role, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.message === 'EMAIL_EXISTS'
            ? 'Cet email existe deja.'
            : 'Inscription impossible. Reessayez.';
      },
    });
  }
}
