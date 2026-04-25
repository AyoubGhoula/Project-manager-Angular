import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  PROJECT_STATUSES,
  Project,
} from '../../../../core/services/project.service';

type NewProjectPayload = Omit<Project, 'id'>;

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css',
})
export class AddProject {
  @Output() projectAdded = new EventEmitter<NewProjectPayload>();

  readonly projectStatuses = PROJECT_STATUSES;

  projectName = '';
  projectDescription = '';
  projectStatus = PROJECT_STATUSES[0];
  successMessage = '';

  addProject(projectForm: NgForm): void {
    if (projectForm.invalid) {
      projectForm.control.markAllAsTouched();
      return;
    }

    const newProject: NewProjectPayload = {
      name: this.projectName.trim(),
      description: this.projectDescription.trim(),
      status: this.projectStatus,
      tasks: [],
    };

    console.log('Nouveau projet soumis:', newProject);
    this.projectAdded.emit(newProject);

    const createdProjectName = newProject.name;
    projectForm.resetForm({
      projectName: '',
      projectDescription: '',
      projectStatus: PROJECT_STATUSES[0],
    });

    this.successMessage = `Le projet "${createdProjectName}" a ete cree avec succes.`;
  }

  onReset(projectForm: NgForm): void {
    projectForm.resetForm({
      projectName: '',
      projectDescription: '',
      projectStatus: PROJECT_STATUSES[0],
    });
    this.successMessage = '';
  }

  clearSuccessMessage(): void {
    if (!this.successMessage) {
      return;
    }
    this.successMessage = '';
  }
}
