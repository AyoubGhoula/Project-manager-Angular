import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskList } from '../task-list/task-list';
import {
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  Project,
  ProjectStatus,
  Task,
  TaskPriority,
} from '../../../../core/services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskList],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail {
  @Input() project!: Project;
  @Output() editRequested = new EventEmitter<Project>();
  @Output() projectChanged = new EventEmitter<Project>();

  readonly projectStatuses = PROJECT_STATUSES;

  showAddForm = false;
  newTaskTitle = '';
  newTaskPriority: TaskPriority = TASK_PRIORITIES[1];
  taskSearchTerm = '';
  taskStatusFilter = '';

  getProgress(): number {
    if (!this.project || this.project.tasks.length === 0) {
      return 0;
    }

    return Math.round(
      (this.project.tasks.filter((task) => task.status === 'Termin\u00E9').length /
        this.project.tasks.length) *
        100
    );
  }

  get filteredTasks(): Task[] {
    return this.project.tasks.filter((task) => {
      const matchesSearch = !this.taskSearchTerm
        || task.title.toLowerCase().includes(this.taskSearchTerm.toLowerCase());
      const matchesStatus = !this.taskStatusFilter || task.status === this.taskStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get completedTasksCount(): number {
    return this.project.tasks.filter((task) => task.status === 'Termin\u00E9').length;
  }

  get highPriorityTasksCount(): number {
    return this.project.tasks.filter((task) => task.priority === 'Haute').length;
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) {
      return;
    }

    this.project.tasks.push({
      title: this.newTaskTitle.trim(),
      priority: this.newTaskPriority,
      status: 'En attente',
    });

    this.newTaskTitle = '';
    this.newTaskPriority = TASK_PRIORITIES[1];
    this.showAddForm = false;
    this.persistChanges();
  }

  changeProjectStatus(status: ProjectStatus): void {
    this.project = {
      ...this.project,
      status,
      lastUpdated: new Date().toISOString(),
      tasks: this.project.tasks.map((task) => ({ ...task })),
    };

    this.projectChanged.emit(this.project);
  }

  onStatusChanged(event: { task: Task; newStatus: string }): void {
    event.task.status = event.newStatus as ProjectStatus;
    this.persistChanges();
  }

  onPriorityChanged(event: { task: Task; newPriority: string }): void {
    event.task.priority = event.newPriority as TaskPriority;
    this.persistChanges();
  }

  onTaskDeleted(task: Task): void {
    const index = this.project.tasks.indexOf(task);
    if (index > -1) {
      this.project.tasks.splice(index, 1);
      this.persistChanges();
    }
  }

  clearTaskFilters(): void {
    this.taskSearchTerm = '';
    this.taskStatusFilter = '';
  }

  onEditProject(): void {
    this.editRequested.emit(this.project);
  }

  private persistChanges(): void {
    this.project = {
      ...this.project,
      lastUpdated: new Date().toISOString(),
      tasks: this.project.tasks.map((task) => ({ ...task })),
    };

    this.projectChanged.emit(this.project);
  }
}
