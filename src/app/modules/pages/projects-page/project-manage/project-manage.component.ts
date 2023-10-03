import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {ProjectModel} from '@core/models';
import {PROJECT_SERVICE} from '@core/services';
import {UrlPageEnum} from '@core/enums';


@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.scss'],
})
export class ProjectManageComponent implements OnInit {
  projectService = inject(PROJECT_SERVICE);

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
    req.subscribe({
        next: () => {
          console.log(value)
          this.router.navigateByUrl(`/${UrlPageEnum.projects}`);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  }

}
