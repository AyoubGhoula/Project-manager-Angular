import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  title: string;
  priority: string;
  status: "En attente" | "En cours" | "Terminé" ;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
})
export class TaskList {

  @Input() tasks: Task[] = [];

  getStatusColor(status: "En attente" | "En cours" | "Terminé"): string {
    switch (status) {
      case 'En attente':
        return 'border-yellow-500';
      case 'En cours':
        return 'border-blue-500';
      case 'Terminé':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  }
}
