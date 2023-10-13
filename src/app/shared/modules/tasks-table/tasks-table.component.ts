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
import {map, of, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {ConfirmWindowComponent, EntriesTableComponent} from '@shared/modules';
import {ConfirmWindowDataModel, ProjectModel, TaskModel} from '@core/models';
import {EMPLOYEE_SERVICE, NotificationService, PROJECT_SERVICE, TASK_SERVICE} from '@core/services';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['entries'] && !!changes['entries'].currentValue) {
    }
  }

  destroyRef = inject(DestroyRef);
  taskService = inject(TASK_SERVICE);
  projectService = inject(PROJECT_SERVICE);
  employeeService = inject(EMPLOYEE_SERVICE);

  tasks!: TaskModel[];

  displayedColumns: string[] = ['id', 'status', 'title', 'projectName',
    'description', 'startDate', 'endDate', 'employeeFullName'];
  labels = {
    id : 'Id',
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
              private notificationService: NotificationService,
              private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    let tasks: Array<TaskModel> = [];
    let projects: Array<ProjectModel> = []
    this.taskService.getTasks()
      .pipe(
        switchMap((data) => {
          tasks = data;
          return this.project
            ? of([this.project])
            : this.projectService.getProjects();
        }),
        switchMap((data) => {
          projects = data;
          return this.employeeService.getEmployees()
        }),
        map((employees) => {
          const projectsIdName: { [key: string | number]: string } = {};
          projects.forEach(pr => {
            if (!!pr.id) {
              projectsIdName[pr.id] = pr.name;
            }
          })
          const employeesIdFullName: { [key: string | number]: string } = {};
          employees.forEach(empl => {
            if (!!empl.id) {
              employeesIdFullName[empl.id] = `${empl.lastName} ${empl.name} ${empl.patronymic}`;
            }
          });
          if (this.project) {
            tasks = tasks.filter(task => task.projectId === this.project?.id);
          }

          return tasks.map(task => {
            const projectName = !!task['projectId'] && projectsIdName[task['projectId']] || '';
            const employeeName = !!task['employeeId'] && employeesIdFullName[task['employeeId']] || '';

            return {...task, projectName, employeeFullName: employeeName} as TaskModel;
          })
        }),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (data) => {
            this.tasks = data;
            this.cdRef.markForCheck();
          },
          error: () => {
            this.notificationService.showErrorNotification('Error: load tasks list is failed!');
          },
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
        switchMap(result => (!!result && !!task.id
          && this.taskService.deleteTask(+task.id)
          || of(false))
        ),
        takeUntilDestroyed(this.destroyRef),)
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          const index = this.tasks.indexOf(task);
          this.tasks.splice(index, 1);
          this.tasks = [...this.tasks];
          this.cdRef.markForCheck();
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete task is failed!');
        }
      });
  }
}
