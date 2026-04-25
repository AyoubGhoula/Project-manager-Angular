import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/components/project-list/project-list';
import { Dashboard } from './features/projects/components/dashboard/dashboard';
import { ContactForm } from './features/forms/components/contact-form/contact-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: ProjectList },
  { path: 'reactive-forms', component: ContactForm },
  { path: '**', redirectTo: '/dashboard' }
];
