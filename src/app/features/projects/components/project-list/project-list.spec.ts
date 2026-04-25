import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Project, ProjectService } from '../../../../core/services/project.service';
import { ProjectList } from './project-list';

describe('ProjectList', () => {
  let component: ProjectList;
  let fixture: ComponentFixture<ProjectList>;

  const projectsSubject = new BehaviorSubject<Project[]>([]);
  const projectServiceMock = {
    projects$: projectsSubject.asObservable(),
    loadProjects: jasmine.createSpy('loadProjects'),
    addProject: jasmine.createSpy('addProject').and.callFake((project: Omit<Project, 'id'>) =>
      of({ ...project, id: 'created-project' })
    ),
    updateProject: jasmine.createSpy('updateProject').and.callFake((project: Project) => of(project)),
    deleteProject: jasmine.createSpy('deleteProject').and.returnValue(of(void 0)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectList],
      providers: [{ provide: ProjectService, useValue: projectServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
