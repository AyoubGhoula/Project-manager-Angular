import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightStatusDirective } from '../../directives/highlight-status.directive';
import { PriorityColorPipe } from '../../pipes/priority-color.pipe';
import {
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  ProjectStatus,
  Task,
  TaskPriority,
} from '../../../../core/services/project.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightStatusDirective, PriorityColorPipe],
  templateUrl: './task-list.html',
})
export class TaskList {
  @Input() tasks: Task[] = [];
  @Output() statusChanged = new EventEmitter<{ task: Task; newStatus: ProjectStatus }>();
  @Output() priorityChanged = new EventEmitter<{ task: Task; newPriority: TaskPriority }>();
  @Output() taskDeleted = new EventEmitter<Task>();

  readonly availablePriorities = TASK_PRIORITIES;
  private readonly statusFlow = [...PROJECT_STATUSES];

  nextStatus(task: Task): void {
    const currentIndex = this.statusFlow.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % this.statusFlow.length;
    this.statusChanged.emit({ task, newStatus: this.statusFlow[nextIndex] });
  }

  changePriority(task: Task, newPriority: TaskPriority): void {
    this.priorityChanged.emit({ task, newPriority });
  }

  deleteTask(task: Task): void {
    this.taskDeleted.emit(task);
  }

  getNextStatusLabel(status: ProjectStatus): ProjectStatus {
    const currentIndex = this.statusFlow.indexOf(status);
    const nextIndex = (currentIndex + 1) % this.statusFlow.length;
    return this.statusFlow[nextIndex];
  }
}
