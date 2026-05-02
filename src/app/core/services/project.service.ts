import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export const PROJECT_STATUSES = ['En attente', 'En cours', 'Termin\u00E9'] as const;
export const TASK_PRIORITIES = ['Haute', 'Moyenne', 'Basse'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  title: string;
  priority: TaskPriority;
  status: ProjectStatus;
}

export interface Project {
  id: number | string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  ownerId?: number | string;
  favorite?: boolean;
  lastUpdated?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/projects';
  
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  loadProjects(): void {
    this.http
      .get<Project[]>(this.apiUrl)
      .pipe(map((projects) => projects.map((project) => this.normalizeProject(project))))
      .subscribe({
      next: (projects) => {
        this.projectsSubject.next(projects);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      },
      });
  }

  getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }

  addProject(projectData: Omit<Project, 'id'>): Observable<Project> {
    const payload = this.normalizeProject({ ...projectData, id: 'draft-project' });
    const { id: _ignoredId, ...newProjectPayload } = payload;

    return this.http.post<Project>(this.apiUrl, newProjectPayload).pipe(
      map((newProject) => this.normalizeProject(newProject)),
      tap((newProject) => {
        const currentProjects = this.getProjects();
        this.projectsSubject.next([newProject, ...currentProjects]);
      })
    );
  }

  updateProject(updatedProject: Project): Observable<Project> {
    const normalizedProject = this.normalizeProject(updatedProject);
    const updateUrl = `${this.apiUrl}/${encodeURIComponent(String(normalizedProject.id))}`;

    return this.http.put<Project>(updateUrl, normalizedProject).pipe(
      map((savedProject) => this.normalizeProject(savedProject)),
      tap((savedProject) => {
        const currentProjects = this.getProjects();
        const updatedProjects = currentProjects.map((project) =>
          project.id === savedProject.id ? savedProject : project
        );
        this.projectsSubject.next(updatedProjects);
      })
    );
  }

  deleteProject(projectId: number | string): Observable<void> {
    const deleteUrl = `${this.apiUrl}/${encodeURIComponent(String(projectId))}`;
    return this.http.delete<void>(deleteUrl).pipe(
      tap(() => {
        const currentProjects = this.getProjects();
        const filteredProjects = currentProjects.filter((p) => p.id !== projectId);
        this.projectsSubject.next(filteredProjects);
      })
    );
  }

  private normalizeProject(project: Project): Project {
    return {
      ...project,
      favorite: project.favorite ?? false,
      lastUpdated: project.lastUpdated ?? new Date().toISOString(),
      tasks: (project.tasks ?? []).map((task) => ({ ...task })),
    };
  }
}
