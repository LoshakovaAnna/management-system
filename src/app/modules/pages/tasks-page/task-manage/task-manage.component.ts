import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import * as moment from 'moment';
import {cloneDeep} from 'lodash';

import {UrlPageEnum} from '@core/enums';
import {EmployeeModel, ProjectModel, TaskModel} from '@core/models';
import {DATE_FORMAT} from '@consts/date.const';
import {EMPLOYEE_SERVICE, NotificationService, PROJECT_SERVICE, TASK_SERVICE} from '@core/services';

@Component({
  selector: 'app-task-manage',
  templateUrl: './task-manage.component.html',
  styleUrls: ['./task-manage.component.scss']
})
export class TaskManageComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  taskService = inject(TASK_SERVICE);
  projectService = inject(PROJECT_SERVICE);
  employeeService = inject(EMPLOYEE_SERVICE);

  projects: ProjectModel[] = [];
  employees: EmployeeModel[] = [];

  title = '';
  isNewTask: boolean = true;
  task!: TaskModel;
  project!: ProjectModel;

  taskForm = new FormGroup({
    id: new FormControl(''),
    status: new FormControl('Not Started', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('',),
    projectId: new FormControl('', [Validators.required]),
    employeeId: new FormControl('', [Validators.required]),
  });
  statuses = [
    'Not Started', 'In progress', 'Finished', 'Delay'
  ];
  returnLink = [`/${UrlPageEnum.tasks}`];

  constructor(private router: Router,
              private notificationService: NotificationService) {
    this.task = this.router.getCurrentNavigation()?.extras?.state?.['task'];
    this.project = this.router.getCurrentNavigation()?.extras?.state?.['project'];
  }

  ngOnInit(): void {
    this.isNewTask = !this.task;
    this.title = this.isNewTask ? ' Create Task' : 'Edit Task';
    if (this.task) {
      if (this.task.startDate) {
        this.task.startDate = moment(this.task.startDate, DATE_FORMAT);
      }
      if (this.task.endDate) {
        this.task.endDate = moment(this.task.endDate, DATE_FORMAT);
      }
      // @ts-ignore
      this.taskForm.patchValue(this.task);
    }
    if (this.project) {
      // @ts-ignore
      this.taskForm.patchValue({projectId: this.project.id});
      this.taskForm.get('projectId')?.disable();
    }
    this.taskForm.get('id')?.disable();


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

    this.employeeService.getEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: load projects list is failed!');
        },
      });
  }


  onSubmit(): void {
    if (!this.taskForm.valid) {
      return;
    }
    this.taskForm.enable();
    const value = cloneDeep(this.taskForm.value);
    if (this.isNewTask) {
      delete value.id;
    }
    if (value.startDate) {
      value.startDate = (value.startDate as unknown as moment.Moment).format(DATE_FORMAT)
    }
    if (value.endDate) {
      value.endDate = (value.endDate as unknown as moment.Moment).format(DATE_FORMAT)
    }
    const req = this.isNewTask
      ? this.taskService.postTask(value as TaskModel)
      : this.taskService.putTask(value as TaskModel);
    req
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
          next: () => {
            this.toPrevPage();
          },
          error: () => {
            this.notificationService.showErrorNotification('Error: send request is failed!');
          }
        }
      );
  }

  toPrevPage() {
    history.back();
  }
}
