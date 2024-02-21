import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {TaskModel} from '@core/models';

export const TASK_SERVICE = new InjectionToken<TaskServiceModel>('task-service');


export interface TaskServiceModel {
//gettasks by projectid
  getTasks(): Observable<Array<TaskModel>>;
  getTaskById(id: number): Observable<TaskModel | undefined>;

  postTask(body: TaskModel): Observable<void | TaskModel>;
  putTask(body: TaskModel): Observable<void>;

  deleteTask(id: number): Observable<void>;
}