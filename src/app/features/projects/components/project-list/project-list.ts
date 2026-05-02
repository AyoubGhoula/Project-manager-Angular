import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  PROJECT_STATUSES,
  Project,
  ProjectService,
  ProjectStatus,
} from '../../../../core/services/project.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AddProject } from '../add-project/add-project';
import { EditProject } from '../edit-project/edit-project';
import { ProjectDetail } from '../project-detail/project-detail';

type SortOption = 'updated' | 'name' | 'progress' | 'tasks';

interface ToastState {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectDetail, AddProject, EditProject],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  readonly projectStatuses = PROJECT_STATUSES;
  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'updated', label: 'Recents' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'progress', label: 'Progression' },
    { value: 'tasks', label: 'Nombre de taches' },
  ];

  searchTerm = '';
  statusFilter = '';
  sortOption: SortOption = 'updated';
  favoritesOnly = false;

  selectedProject: Project | null = null;
  editingProject: Project | null = null;
  projectPendingDelete: Project | null = null;
  toast: ToastState | null = null;

  isAddModalOpen = false;
  isLoading = false;
  errorMessage: string | null = null;
  projects: Project[] = [];

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.isLoading = true;

    this.projectService.projects$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des projets:', error);
          this.errorMessage = "Impossible de charger les projets. Verifiez que l'API est demarree.";
          this.isLoading = false;
        },
      });

    this.projectService.loadProjects();
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.projectPendingDelete) {
      this.projectPendingDelete = null;
      return;
    }

    if (this.editingProject) {
      this.editingProject = null;
      return;
    }

    if (this.selectedProject) {
      this.selectedProject = null;
      return;
    }

    if (this.isAddModalOpen) {
      this.isAddModalOpen = false;
    }
  }

  get filteredProjects(): Project[] {
    let result = [...this.projects];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(term)
          || project.description.toLowerCase().includes(term)
          || project.tasks.some((task) => task.title.toLowerCase().includes(term))
      );
    }

    if (this.statusFilter) {
      result = result.filter((project) => project.status === this.statusFilter);
    }

    if (this.favoritesOnly) {
      result = result.filter((project) => project.favorite);
    }

    result.sort((left, right) => {
      switch (this.sortOption) {
        case 'name':
          return left.name.localeCompare(right.name);
        case 'progress':
          return this.getProjectProgress(right) - this.getProjectProgress(left);
        case 'tasks':
          return right.tasks.length - left.tasks.length;
        case 'updated':
        default:
          return this.getLastUpdatedTime(right) - this.getLastUpdatedTime(left);
      }
    });

    return result;
  }

  get uniqueStatuses(): string[] {
    return this.projectStatuses.filter((status) =>
      this.projects.some((project) => project.status === status)
    );
  }

  get totalTasks(): number {
    return this.projects.reduce((sum, project) => sum + project.tasks.length, 0);
  }

  get favoriteProjectsCount(): number {
    return this.projects.filter((project) => project.favorite).length;
  }

  get activeProjectsCount(): number {
    return this.projects.filter((project) => project.status === 'En cours').length;
  }

  get completionRate(): number {
    if (this.totalTasks === 0) {
      return 0;
    }

    const completedTasks = this.projects.reduce(
      (sum, project) => sum + project.tasks.filter((task) => task.status === 'Termin\u00E9').length,
      0
    );

    return Math.round((completedTasks / this.totalTasks) * 100);
  }

  openAddProjectModal(): void {
    this.isAddModalOpen = true;
    this.errorMessage = null;
  }

  closeAddProjectModal(): void {
    this.isAddModalOpen = false;
  }

  onProjectAdded(projectData: Omit<Project, 'id'>): void {
    const currentUser = this.authService.getCurrentUser();

    this.projectService
      .addProject({
        ...projectData,
        favorite: false,
        lastUpdated: new Date().toISOString(),
        ownerId: currentUser?.id,
        tasks: projectData.tasks.map((task) => ({ ...task })),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdProject) => {
          this.isAddModalOpen = false;
          this.selectedProject = this.cloneProject(createdProject);
          this.showToast('success', 'Projet cree', `"${createdProject.name}" est pret a etre pilote.`);
        },
        error: (error) => {
          console.error('Erreur lors de la creation du projet:', error);
          this.errorMessage = 'Erreur lors de la creation du projet.';
          this.showToast('error', 'Creation impossible', 'Le projet n a pas pu etre ajoute.');
        },
      });
  }

  selectProject(project: Project): void {
    this.selectedProject = this.cloneProject(project);
    this.editingProject = null;
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
  }

  onEditRequested(project: Project): void {
    this.editingProject = this.cloneProject(project);
  }

  onEditCancelled(): void {
    this.editingProject = null;
  }

  onProjectUpdated(updatedProject: Project): void {
    this.persistProjectUpdate(updatedProject, {
      successTitle: 'Projet mis a jour',
      successMessage: `"${updatedProject.name}" a ete actualise avec succes.`,
      closeEditModal: true,
    });
  }

  onProjectChanged(project: Project): void {
    this.persistProjectUpdate(project, {
      successTitle: 'Projet synchronise',
      successMessage: 'Les modifications du projet ont ete enregistrees.',
      closeEditModal: false,
    });
  }

  requestDeleteProject(project: Project): void {
    this.projectPendingDelete = project;
  }

  cancelDeleteProject(): void {
    this.projectPendingDelete = null;
  }

  confirmDeleteProject(): void {
    if (!this.projectPendingDelete) {
      return;
    }

    const projectToDelete = this.projectPendingDelete;

    this.projectService
      .deleteProject(projectToDelete.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.selectedProject?.id === projectToDelete.id) {
            this.selectedProject = null;
          }

          if (this.editingProject?.id === projectToDelete.id) {
            this.editingProject = null;
          }

          this.projectPendingDelete = null;
          this.showToast('success', 'Projet supprime', `"${projectToDelete.name}" a ete retire.`);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du projet:', error);
          this.errorMessage = 'Erreur lors de la suppression du projet.';
          this.showToast('error', 'Suppression impossible', 'Le projet n a pas pu etre supprime.');
        },
      });
  }

  toggleFavorite(project: Project): void {
    const updatedProject = this.cloneProject({
      ...project,
      favorite: !project.favorite,
      lastUpdated: new Date().toISOString(),
    });

    this.projectService
      .updateProject(updatedProject)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (savedProject) => {
          this.syncProjectOverlays(savedProject);
          this.showToast(
            'info',
            savedProject.favorite ? 'Projet epingle' : 'Projet desepingle',
            savedProject.favorite
              ? `"${savedProject.name}" est maintenant prioritaire.`
              : `"${savedProject.name}" ne fait plus partie des favoris.`
          );
        },
        error: (error) => {
          console.error('Erreur lors de la mise a jour du favori:', error);
          this.showToast('error', 'Action impossible', 'La mise a jour du favori a echoue.');
        },
      });
  }

  duplicateProject(project: Project): void {
    const duplicatedProject: Omit<Project, 'id'> = {
      name: `${project.name} (copie)`,
      description: project.description,
      status: 'En attente',
      favorite: false,
      lastUpdated: new Date().toISOString(),
      tasks: project.tasks.map((task) => ({
        ...task,
        status: 'En attente',
      })),
    };

    this.projectService
      .addProject(duplicatedProject)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdProject) => {
          this.selectedProject = this.cloneProject(createdProject);
          this.showToast(
            'success',
            'Projet duplique',
            `Une nouvelle copie de "${project.name}" a ete creee.`
          );
        },
        error: (error) => {
          console.error('Erreur lors de la duplication du projet:', error);
          this.showToast('error', 'Duplication impossible', 'Le projet n a pas pu etre copie.');
        },
      });
  }

  cycleProjectStatus(project: Project): void {
    const nextStatus = this.getNextProjectStatus(project.status);
    const updatedProject = this.cloneProject({
      ...project,
      status: nextStatus,
      lastUpdated: new Date().toISOString(),
    });

    this.projectService
      .updateProject(updatedProject)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (savedProject) => {
          this.syncProjectOverlays(savedProject);
          this.showToast(
            'info',
            'Statut mis a jour',
            `"${savedProject.name}" est passe en "${savedProject.status}".`
          );
        },
        error: (error) => {
          console.error('Erreur lors du changement de statut:', error);
          this.showToast('error', 'Statut non modifie', 'Le nouveau statut n a pas pu etre sauvegarde.');
        },
      });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.sortOption = 'updated';
    this.favoritesOnly = false;
  }

  dismissToast(): void {
    this.toast = null;
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  }

  getProjectProgress(project: Project): number {
    if (project.tasks.length === 0) {
      return 0;
    }

    return Math.round(
      (project.tasks.filter((task) => task.status === 'Termin\u00E9').length / project.tasks.length)
        * 100
    );
  }

  getCompletedTasks(project: Project): number {
    return project.tasks.filter((task) => task.status === 'Termin\u00E9').length;
  }

  getPendingTasks(project: Project): number {
    return project.tasks.filter((task) => task.status !== 'Termin\u00E9').length;
  }

  trackProject(_index: number, project: Project): number | string {
    return project.id;
  }

  private persistProjectUpdate(
    updatedProject: Project,
    options: { successTitle: string; successMessage: string; closeEditModal: boolean }
  ): void {
    const payload = this.cloneProject({
      ...updatedProject,
      lastUpdated: new Date().toISOString(),
    });

    this.projectService
      .updateProject(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (savedProject) => {
          this.syncProjectOverlays(savedProject);
          if (options.closeEditModal) {
            this.editingProject = null;
          }
          this.showToast('success', options.successTitle, options.successMessage);
        },
        error: (error) => {
          console.error('Erreur lors de la mise a jour du projet:', error);
          this.errorMessage = 'Erreur lors de la mise a jour du projet.';
          this.showToast('error', 'Mise a jour impossible', 'Les changements n ont pas pu etre enregistres.');
        },
      });
  }

  private syncProjectOverlays(project: Project): void {
    if (this.selectedProject?.id === project.id) {
      this.selectedProject = this.cloneProject(project);
    }

    if (this.editingProject?.id === project.id) {
      this.editingProject = this.cloneProject(project);
    }
  }

  private cloneProject(project: Project): Project {
    return {
      ...project,
      tasks: project.tasks.map((task) => ({ ...task })),
    };
  }

  private getNextProjectStatus(status: ProjectStatus): ProjectStatus {
    const currentIndex = this.projectStatuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % this.projectStatuses.length;
    return this.projectStatuses[nextIndex];
  }

  private getLastUpdatedTime(project: Project): number {
    return new Date(project.lastUpdated ?? 0).getTime();
  }

  private showToast(type: ToastState['type'], title: string, message: string): void {
    this.toast = { type, title, message };

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = setTimeout(() => {
      this.toast = null;
      this.toastTimeoutId = null;
    }, 3500);
  }
}
