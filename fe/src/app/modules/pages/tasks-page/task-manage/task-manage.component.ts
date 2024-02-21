import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import * as moment from 'moment';
import {cloneDeep} from 'lodash';
import {first, forkJoin} from 'rxjs';

import {UrlPageEnum} from '@core/enums';
import {EmployeeModel, ProjectModel, TaskModel} from '@core/models';
import {DATE_FORMAT} from '@consts/date.const';
import {EMPLOYEE_SERVICE, PROJECT_SERVICE, SpinnerService, TASK_SERVICE} from '@core/services';

@Component({
  selector: 'app-task-manage',
  templateUrl: './task-manage.component.html',
  styleUrls: ['./task-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskManageComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  taskService = inject(TASK_SERVICE);
  projectService = inject(PROJECT_SERVICE);
  employeeService = inject(EMPLOYEE_SERVICE);
  spinnerService = inject(SpinnerService);

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
              private cdRef: ChangeDetectorRef) {
    this.task = this.router.getCurrentNavigation()?.extras?.state?.['task'];
    this.project = this.router.getCurrentNavigation()?.extras?.state?.['project'];
  }

  ngOnInit(): void {
    this.isNewTask = !this.task;
    this.title = this.isNewTask ? ' Create Task' : 'Edit Task';
    if (this.task) {
      if (this.task.startDate) {
        this.task.startDate = moment(this.task.startDate);
      }
      if (this.task.endDate) {
        this.task.endDate = moment(this.task.endDate);
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

    this.spinnerService.showSpinner();

    forkJoin({
      projects: this.projectService.getProjects(),
      employees: this.employeeService.getEmployees()
    })
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          [this.projects, this.employees] = [data.projects, data.employees];
          this.cdRef.markForCheck();
        },
      )
      .add(() => {
      this.spinnerService.hideSpinner();
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

    this.spinnerService.showSpinner();
    const req = this.isNewTask
      ? this.taskService.postTask(value as TaskModel)
      : this.taskService.putTask(value as TaskModel);
    req
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toPrevPage();
        },
      })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }

  toPrevPage() {
    history.back();
  }
}
