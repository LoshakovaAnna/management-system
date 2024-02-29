import {FormControl} from '@angular/forms';

import {EmployeeModel, ProjectModel, TaskModel} from '../models';

export type ToFormControls<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export type TaskForm = ToFormControls<TaskModel>;
export type EmployeeForm = ToFormControls<EmployeeModel>;
export type ProjectForm = ToFormControls<ProjectModel>;
