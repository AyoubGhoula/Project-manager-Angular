import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FormsCard {
  title: string;
  description: string;
  route: string;
  badge: string;
}

@Component({
  selector: 'app-forms-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './forms-landing.html',
  styleUrl: './forms-landing.css',
})
export class FormsLanding {
  readonly cards: FormsCard[] = [
    {
      badge: 'P1',
      title: 'Partie 1 - Bases',
      description: 'FormControl + FormGroup + validations de base.',
      route: '/forms/basics',
    },
    {
      badge: 'P2',
      title: 'Partie 2 - Validations',
      description: 'Validations personnalisees et asynchrones.',
      route: '/forms/validators',
    },
    {
      badge: 'P3',
      title: 'Partie 3 - FormBuilder',
      description: 'Creation rapide de formulaires + utilitaires.',
      route: '/forms/formbuilder',
    },
    {
      badge: 'P4',
      title: 'Partie 4 - FormArray',
      description: 'Emails dynamiques et competences.',
      route: '/forms/formarray',
    },
    {
      badge: 'P5',
      title: 'Partie 5 - Imbriques',
      description: 'Adresse imbriquee et liste d\'adresses.',
      route: '/forms/nested',
    },
    {
      badge: 'P6',
      title: 'Partie 6 - Erreurs',
      description: 'ValidationService et directive d\'erreur.',
      route: '/forms/errors',
    },
  ];
}
