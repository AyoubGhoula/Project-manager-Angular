import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ValidationService } from '../../../forms/services/validation.service';
import { ShowErrorDirective } from '../../../forms/directives/show-error.directive';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ShowErrorDirective],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css',
})
export class AuthLogin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly validationService = inject(ValidationService);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email(): FormControl | null {
    return this.loginForm.get('email') as FormControl | null;
  }

  get password(): FormControl | null {
    return this.loginForm.get('password') as FormControl | null;
  }

  submitForm(): void {
    this.loginForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value as { email: string; password: string };

    this.isLoading = true;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe invalide.';
      },
    });
  }
}
