import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TaskList],
  templateUrl: './project-list.html',
})
export class ProjectList {

  projects = [
    {
      name: 'project manager',
      description: 'Apprendre à créer une application simple de gestion de projets avec Angular, comprendre la création des composants réutilisables et intégrer Tailwind pour le style.',
      status: 'Terminé',
      tasks: [
        { title: 'Architecture du projet', priority: 'Haute', status: 'Terminé' },
        { title: 'Créer le projet Angular avec Tailwind', priority: 'Moyenne', status: 'Terminé' },
        { title: 'Développer les composants de base', priority: 'Haute', status: 'Terminé' },
        { title: 'Intégrer Tailwind pour le style', priority: 'Moyenne', status: 'Terminé' },
        { title: 'Tester et déployer l\'application', priority: 'Basse', status: 'Terminé' }
      ]
    },
    {
      name: 'E-commerce Platform',
      description: 'Développer une plateforme de commerce électronique avec panier, paiement et gestion des commandes.',
      status: 'En cours',
      tasks: [
        { title: 'Design de la base de données', priority: 'Haute', status: 'Terminé' },
        { title: 'Développer l\'API REST', priority: 'Haute', status: 'En cours' },
        { title: 'Créer l\'interface du panier', priority: 'Haute', status: 'En attente' },
        { title: 'Intégrer la passerelle de paiement', priority: 'Haute', status: 'En attente' },
        { title: 'Tests et optimisation', priority: 'Moyenne', status: 'En attente' }
      ]
    },
    {
      name: 'Mobile App Development',
      description: 'Créer une application mobile native pour iOS et Android avec synchronisation cloud.',
      status: 'En attente',
      tasks: [
        { title: 'Définir les spécifications', priority: 'Haute', status: 'Terminé' },
        { title: 'Développer l\'interface utilisateur', priority: 'Haute', status: 'En attente' },
        { title: 'Implémenter la synchronisation cloud', priority: 'Haute', status: 'En attente' },
        { title: 'Tests sur appareils réels', priority: 'Moyenne', status: 'En attente' },
        { title: 'Publier sur les stores', priority: 'Basse', status: 'En attente' }
      ]
    },
    {
      name: 'Data Analytics Dashboard',
      description: 'Créer un tableau de bord d\'analyse de données avec visualisations en temps réel.',
      status: 'En cours',
      tasks: [
        { title: 'Collecte des données', priority: 'Haute', status: 'Terminé' },
        { title: 'Concevoir les visualisations', priority: 'Haute', status: 'En cours' },
        { title: 'Implémenter les graphiques', priority: 'Moyenne', status: 'En cours' },
        { title: 'Ajouter les filtres et recherche', priority: 'Moyenne', status: 'En attente' },
        { title: 'Optimiser les performances', priority: 'Moyenne', status: 'En attente' }
      ]
    }
  ];
}
