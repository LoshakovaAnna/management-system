import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {TaskModel} from '@core/models';

export const TASK_SERVICE = new InjectionToken<TaskServiceModel>('task-service');


export interface TaskServiceModel {
  getTasks(): Observable<Array<TaskModel>>;
  getTaskById(id: string): Observable<TaskModel | undefined>;

  postTask(body: TaskModel): Observable<void | TaskModel>;
  putTask(body: TaskModel): Observable<void>;

  deleteTask(id: string): Observable<void>;
}
