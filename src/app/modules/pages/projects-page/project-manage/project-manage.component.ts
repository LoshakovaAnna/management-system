import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ProjectModel} from '@core/models';
import {NotificationService, PROJECT_SERVICE} from '@core/services';

@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectManageComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  projectService = inject(PROJECT_SERVICE);

  title = '';
  isNewProject: boolean = true;
  project!: ProjectModel;

  projectForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router,
              private notificationService: NotificationService) {
    this.project = this.router.getCurrentNavigation()?.extras?.state?.['project'];
  }

  ngOnInit(): void {
    this.isNewProject = !this.project;
    this.title = this.isNewProject ? ' Create Project' : 'Edit Project';
    if (this.project) {
      // @ts-ignore
      this.projectForm.patchValue(this.project);
    }
    this.projectForm.get('id')?.disable();
  }


  onSubmit(): void {
    this.projectForm.enable();
    const value = this.projectForm.value;
    if (this.isNewProject) {
      delete value.id;
    }

    const req = this.isNewProject
      ? this.projectService.postProject(value as ProjectModel)
      : this.projectService.putProject(value as ProjectModel);
    req
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toPrev();
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: send request is failed!');
        }
      });
  }

  toPrev(): void {
    history.back();
  }

}
