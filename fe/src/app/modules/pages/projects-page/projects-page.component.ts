import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import {of, switchMap, tap} from 'rxjs';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';

import {PROJECT_SERVICE, SpinnerService} from '@core/services';
import {ConfirmWindowDataModel, DEFAULT_TABLE_CONFIG, ProjectModel, TableConfigModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';
import {UrlPageEnum} from '@core/enums';


@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  projectService = inject(PROJECT_SERVICE);
  spinnerService = inject(SpinnerService);

  projects!: ProjectModel[];
  totalAmount: number = 0;
  displayedColumns: string[] = ['name', 'description'];

  constructor(private router: Router,
              public dialog: MatDialog,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.onChangePageConfig(DEFAULT_TABLE_CONFIG);
  }

  onChangePageConfig(config: TableConfigModel){
    this.spinnerService.showSpinner();
    this.projectService.getProjectsPaginator(config)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.totalAmount = data.total;
          this.projects = data.projects;
          this.cdRef.markForCheck();
        },
      })
      .add(() => {
        this.spinnerService.hideSpinner();
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
        tap(() => this.spinnerService.showSpinner()),
        switchMap(result => (!!result && !!project.id
            && this.projectService.deleteProject(project.id)
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
          this.cdRef.markForCheck();
        },
      })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }

}
