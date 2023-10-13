import {AfterViewInit, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {of, switchMap} from 'rxjs';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';

import {NotificationService, PROJECT_SERVICE} from '@core/services';
import {ConfirmWindowDataModel, ProjectModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';
import {UrlPageEnum} from '@core/enums';


@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  projectService = inject(PROJECT_SERVICE);

  projects!: ProjectModel[];
  displayedColumns: string[] = ['id', 'name', 'description'];

  constructor(private router: Router,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.projectService.getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.projects = data;
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: load projects list is failed!');
        },
      });
  }

  onAddProject() {
    this.router
      .navigateByUrl(`${UrlPageEnum.projects}/${UrlPageEnum.manageProject}`);
  }

  onEditProject(project: ProjectModel) {
    this.router
      .navigateByUrl(`${UrlPageEnum.projects}/${UrlPageEnum.manageProject}`, {
        state: {isNewProject: false, project}
      });
  }


  onDeleteProject(project: ProjectModel) {
    const dialogRef = this.dialog.open(ConfirmWindowComponent, {
      data: {
        title: 'Confirm',
        text: `Are you really want to delete '${project.name}' project?`,
        acceptBtnLabel: 'Yes',
        declineBtnLabel: 'No'
      } as ConfirmWindowDataModel,
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(result => (!!result && !!project.id
            && this.projectService.deleteProject(+project.id)
            || of(false)
          )
        ),
        takeUntilDestroyed(this.destroyRef),)
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          const index = this.projects.indexOf(project);
          this.projects.splice(index, 1);
          this.projects = [...this.projects];
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete project is failed!');
        }
      });
  }

}
