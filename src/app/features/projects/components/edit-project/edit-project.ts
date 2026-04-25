import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  PROJECT_STATUSES,
  Project,
} from '../../../../core/services/project.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProject implements OnChanges {
  @Input() project!: Project;
  @Output() projectUpdated = new EventEmitter<Project>();
  @Output() editCancelled = new EventEmitter<void>();

  readonly projectStatuses = PROJECT_STATUSES;

  editableProject: Project = {
    id: '',
    name: '',
    description: '',
    status: PROJECT_STATUSES[0],
    tasks: [],
    favorite: false,
    lastUpdated: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['project'] || !this.project) {
      return;
    }

    this.editableProject = {
      ...this.project,
      tasks: this.project.tasks.map((task) => ({ ...task })),
    };
  }

  onSubmit(projectForm: NgForm): void {
    if (projectForm.invalid) {
      projectForm.control.markAllAsTouched();
      return;
    }

    this.projectUpdated.emit({
      ...this.editableProject,
      lastUpdated: new Date().toISOString(),
      tasks: this.editableProject.tasks.map((task) => ({ ...task })),
    });
  }

  onCancel(): void {
    this.editCancelled.emit();
  }
}
