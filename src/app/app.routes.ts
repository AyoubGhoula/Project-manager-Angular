import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/components/project-list/project-list';
import { Dashboard } from './features/projects/components/dashboard/dashboard';
import { ContactForm } from './features/forms/components/contact-form/contact-form';
import { FormsLanding } from './features/forms/components/forms-landing/forms-landing';
import { FormsValidators } from './features/forms/components/forms-validators/forms-validators';
import { FormsFormBuilder } from './features/forms/components/forms-formbuilder/forms-formbuilder';
import { FormsFormArray } from './features/forms/components/forms-formarray/forms-formarray';
import { FormsNested } from './features/forms/components/forms-nested/forms-nested';
import { FormsErrors } from './features/forms/components/forms-errors/forms-errors';
import { AuthLogin } from './features/auth/components/auth-login/auth-login';
import { AuthRegister } from './features/auth/components/auth-register/auth-register';
import { AuthProfile } from './features/auth/components/auth-profile/auth-profile';
import { ContactPage } from './features/contact/components/contact-page/contact-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: ProjectList },
  { path: 'contact', component: ContactPage },
  { path: 'auth/login', component: AuthLogin },
  { path: 'auth/register', component: AuthRegister },
  { path: 'profile', component: AuthProfile, canActivate: [authGuard] },
  { path: 'forms', component: FormsLanding, pathMatch: 'full' },
  { path: 'forms/basics', component: ContactForm },
  { path: 'forms/validators', component: FormsValidators },
  { path: 'forms/formbuilder', component: FormsFormBuilder },
  { path: 'forms/formarray', component: FormsFormArray },
  { path: 'forms/nested', component: FormsNested },
  { path: 'forms/errors', component: FormsErrors },
  { path: 'reactive-forms', redirectTo: '/forms', pathMatch: 'full' },
  { path: 'auth', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
