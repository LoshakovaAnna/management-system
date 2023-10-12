import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {TaskFullModel, TaskModel} from '@core/models';

export const TASK_SERVICE = new InjectionToken<TaskServiceModel>('task-service');


export interface TaskServiceModel {

  getTasks(): Observable<Array<TaskModel>>;
  getTaskById(id: number): Observable<TaskModel | undefined>;

  postTask(body: TaskFullModel): Observable<void | TaskModel>;
  putTask(body: TaskFullModel): Observable<void>;

  deleteTask(id: number): Observable<void>;
}
