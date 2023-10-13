import {AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, of, switchMap} from 'rxjs';

import {NotificationService, PROJECT_SERVICE, TASK_SERVICE} from '@core/services';
import {ConfirmWindowDataModel, TaskFullModel, TaskModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements AfterViewInit {

  destroyRef = inject(DestroyRef);
  taskService = inject(TASK_SERVICE);
  projectService = inject(PROJECT_SERVICE);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TaskModel>;

  tasks!: TaskFullModel[];
  dataSource: MatTableDataSource<TaskFullModel> = new MatTableDataSource([] as TaskFullModel[]);

  displayedColumns: string[] = ['id', 'status', 'title', 'projectName', 'description', 'startDate', 'endDate'];
  extraDisplayedColumns: string[] = [...this.displayedColumns, 'action'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngAfterViewInit(): void {
    let tasks: Array<TaskFullModel> = [];
    this.taskService.getTasks()
      .pipe(
        switchMap((data) => {
          tasks = data;
          return this.projectService.getProjects()
        }),
        map((projects) => {
          const projectsIdName: { [key: string | number]: string } = {};
          projects.forEach(pr => {
            if (!!pr.id) {
              projectsIdName[pr.id] = pr.name;
            }
          })
          return tasks.map(task => {
            const projectName = !!task['projectId'] && projectsIdName[task['projectId']] || '';
            return {...task, projectName} as TaskFullModel;
          })
        }),
        takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: (data) => {
            this.tasks = data;
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error: () => {
            this.notificationService.showErrorNotification('Error: load tasks list is failed!');
          },
        });
  }

  onEditTask(task: TaskModel) {
    this.router
      .navigate(['manage-task'], {
        relativeTo: this.route,
        state: {isNewTask: false, task: task}
      })
      .then(r => console.warn('redirect', r));
  }

  onAddTasks() {
    this.router
      .navigate(['manage-task'], {
        relativeTo: this.route,
      })

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
            || of(false)
          )
        ),
        takeUntilDestroyed(this.destroyRef),)
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          const index = this.tasks.indexOf(task);
          this.tasks.splice(index, 1);
          this.dataSource.data = this.tasks;
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete task is failed!');
        }
      });
  }

}
