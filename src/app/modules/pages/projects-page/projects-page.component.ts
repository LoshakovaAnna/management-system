import {AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {of, switchMap} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';

import {NotificationServer, PROJECT_SERVICE} from '@core/services';
import {ConfirmWindowDataModel, ProjectModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';


@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  projectService = inject(PROJECT_SERVICE);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProjectModel>;

  projects!: ProjectModel[];
  dataSource: MatTableDataSource<ProjectModel> = new MatTableDataSource([] as ProjectModel[]);

  displayedColumns: string[] = ['id', 'name', 'description'];
  extraDisplayedColumns: string[] = [...this.displayedColumns, 'action'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private notificationServer: NotificationServer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.projectService.getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (data) => {
            this.projects = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: () => {
            this.notificationServer.showErrorNotification('Error: load projects list is failed!');
          },
        });
  }

  onEditProject(project: ProjectModel) {
    this.router
      .navigate(['manage-project'], {
        relativeTo: this.route,
        state: {isNewProject: false, project}
      })
      .then(r => console.warn('redirect', r));
  }

  onAddProject() {
    this.router
      .navigate(['manage-project'], {
        relativeTo: this.route,
      })

  }

  onDeleteProject(project: ProjectModel) {
    const dialogRef = this.dialog.open(ConfirmWindowComponent, {
      data: {
        title: 'Confirm',
        text: `Are you really want to delete "${project.name}" project?`,
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
            this.dataSource.data = this.projects;
          },
          error: () => {
            this.notificationServer.showErrorNotification('Error: delete project is failed!');
          }
        });
  }

}
