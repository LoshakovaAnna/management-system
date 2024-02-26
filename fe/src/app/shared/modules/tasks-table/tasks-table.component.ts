import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {first, of, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ConfirmWindowComponent, EntriesTableComponent} from '@shared/modules';
import {ConfirmWindowDataModel, DEFAULT_TABLE_CONFIG, ProjectModel, TableConfigModel, TaskModel} from '@core/models';
import {EMPLOYEE_SERVICE, PROJECT_SERVICE, SpinnerService, TASK_SERVICE} from '@core/services';
import {UrlPageEnum} from '@core/enums';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [CommonModule, EntriesTableComponent],
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTableComponent implements OnChanges, AfterViewInit {
  @Input() project?: ProjectModel;

  totalAmount: number = 0;

  currentTablePageConfig: TableConfigModel = DEFAULT_TABLE_CONFIG;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['project'] && !!changes['project'].currentValue) {
      console.log(changes && changes['project'] && changes['project'].currentValue)
    }
  }

  destroyRef = inject(DestroyRef);
  taskService = inject(TASK_SERVICE);
  projectService = inject(PROJECT_SERVICE);
  employeeService = inject(EMPLOYEE_SERVICE);
  spinnerService = inject(SpinnerService);

  tasks!: TaskModel[];

  displayedColumns: string[] = ['status', 'title', 'projectName',
    'description', 'startDate', 'endDate', 'employeeFullName'];
  labels = {
    id: 'Id',
    status: 'Status',
    title: 'Title',
    projectName: 'Project Name',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    employeeFullName: 'Employee',
  };

  constructor(private router: Router,
              public dialog: MatDialog,
              private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.onChangePageConfig(DEFAULT_TABLE_CONFIG);
  }

  onChangePageConfig(config: TableConfigModel) {
    this.currentTablePageConfig = config;
    this.refreshTablePage();

  }

  refreshTablePage() {

    this.spinnerService.showSpinner();  //todo jump
    const req = this.project && this.project.id
      ? this.taskService.getTaskByProjectId(this.project.id, this.currentTablePageConfig)
      : this.taskService.getTasksPaginator(this.currentTablePageConfig);

    req.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe(
        {
          next: (data) => {
            this.tasks = data.tasks;
            this.totalAmount = data.total
            this.cdRef.markForCheck();
          }
        })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }

  onEditTask(task: TaskModel) {
    this.router
      .navigateByUrl(`${UrlPageEnum.tasks}/${UrlPageEnum.manageTask}`, {
        state: {isNewTask: false, task: task, project: this.project}
      })
      .then(r => console.warn('redirect', r));
  }

  onAddTasks() {
    this.router
      .navigateByUrl(`${UrlPageEnum.tasks}/${UrlPageEnum.manageTask}`,
        {
          state: {isNewTask: true, project: this.project}
        });
  }

  onDeleteTask(task: TaskModel) {
    const dialogRef = this.dialog.open(ConfirmWindowComponent, {
      data: {
        title: 'Confirm',
        text: `Are you really want to delete '${task.title}' task?`,
        acceptBtnLabel: 'Yes',
        declineBtnLabel: 'No'
      } as ConfirmWindowDataModel,
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(result => {
          this.spinnerService.showSpinner();
          return !!result && !!task.id && this.taskService.deleteTask(task.id)
            || of(false);
        }),
        first(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          this.refreshTablePage();
        }
      })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }
}
