import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ProjectModel} from '@core/models';
import {PROJECT_SERVICE, SpinnerService} from '@core/services';

@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectManageComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  projectService = inject(PROJECT_SERVICE);
  spinnerService = inject(SpinnerService);

  title = '';
  isNewProject: boolean = true;
  project!: ProjectModel;

  projectForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router) {
    this.project = this.router.getCurrentNavigation()?.extras?.state?.['project'];
  }

  ngOnInit(): void {
    this.isNewProject = !this.project;
    this.title = this.isNewProject ? ' Create Project' : 'Edit Project';
    if (this.project) {
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

    this.spinnerService.showSpinner();
    const req = this.isNewProject
      ? this.projectService.postProject(value as ProjectModel)
      : this.projectService.putProject(value as ProjectModel);
    req
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toPrev();
        },
      })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }

  toPrev(): void {
    history.back();
  }

}
