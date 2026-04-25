import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../../../core/services/project.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly projectService = inject(ProjectService);
  
  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects;
    });
    this.projectService.loadProjects();
  }

  get totalProjects(): number {
    return this.projects.length;
  }

  get completedProjects(): number {
    return this.projects.filter((p) => p.status === 'Terminé').length;
  }

  get inProgressProjects(): number {
    return this.projects.filter((p) => p.status === 'En cours').length;
  }

  get pendingProjects(): number {
    return this.projects.filter((p) => p.status === 'En attente').length;
  }

  get totalTasks(): number {
    return this.projects.reduce((sum, p) => sum + p.tasks.length, 0);
  }

  get completedTasks(): number {
    return this.projects.reduce(
      (sum, p) => sum + p.tasks.filter((t: Task) => t.status === 'Terminé').length,
      0
    );
  }

  get highPriorityTasks(): number {
    return this.projects.reduce(
      (sum, p) => sum + p.tasks.filter((t: Task) => t.priority === 'Haute').length,
      0
    );
  }

  get averageTasksPerProject(): number {
    if (this.totalProjects === 0) return 0;
    return Math.round(this.totalTasks / this.totalProjects);
  }

  get completionRate(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  getStatusPercentage(status: string): number {
    if (this.totalProjects === 0) return 0;
    const count = this.projects.filter((p) => p.status === status).length;
    return Math.round((count / this.totalProjects) * 100);
  }
}

interface Task {
  title: string;
  priority: string;
  status: string;
}
