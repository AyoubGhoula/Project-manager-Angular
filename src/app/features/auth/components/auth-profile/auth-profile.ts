import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { Project, ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-auth-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-profile.html',
  styleUrl: './auth-profile.css',
})
export class AuthProfile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.projects$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((projects) => {
      this.projects = projects;
    });
    this.projectService.loadProjects();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get userProjects(): Project[] {
    const user = this.currentUser;

    if (!user) {
      return [];
    }

    const userId = String(user.id);

    return this.projects.filter((project) => String(project.ownerId ?? '') === userId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
