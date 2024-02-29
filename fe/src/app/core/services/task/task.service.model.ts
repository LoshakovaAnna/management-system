import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {TableConfigModel, TaskModel, TaskPageModel} from '@core/models';

export const TASK_SERVICE = new InjectionToken<TaskServiceModel>('task-service');


export interface TaskServiceModel {
  getTasks(): Observable<Array<TaskModel>>;
  getTasksPaginator(config: TableConfigModel):Observable<TaskPageModel>
  getTaskById(id: string): Observable<TaskModel | undefined>;
  getTaskByProjectId(id: string, config: TableConfigModel): Observable<TaskPageModel>;

  postTask(body: TaskModel): Observable<void | TaskModel>;
  putTask(body: TaskModel): Observable<void>;

  deleteTask(id: string): Observable<void>;
}
