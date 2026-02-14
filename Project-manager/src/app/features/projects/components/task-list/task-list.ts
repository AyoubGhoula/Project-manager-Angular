import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { get } from 'http';

interface Task {
  title: string;
  priority: string;
  status: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
})
export class TaskList {

  @Input() tasks: Task[] = [];

  getStatusColor(status: string) {
    switch (status) {
      case 'En attente':
        return 'border-yellow-500';
      case 'En cours':
        return 'border-cyan-500';
      case 'Terminé':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  }

  getBGStatusColor(status: string) {
    switch (status) {
      case 'En attente':
        return 'bg-amber-200'; 
      case 'En cours':
        return 'bg-sky-200';
      case 'Terminé':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  }
}

 

