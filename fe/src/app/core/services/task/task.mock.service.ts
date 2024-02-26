import {Injectable} from '@angular/core';
import {from, map, Observable, switchMap} from 'rxjs';

import {TaskServiceModel} from './task.service.model';
import {TableConfigModel, TaskModel, TaskPageModel} from '@core/models';
import {DatabaseService} from '@core/services';

@Injectable({
  providedIn: 'root'
})
export class TaskMockService implements TaskServiceModel {

  constructor(private dbService: DatabaseService) {
  }

  getTasks(): Observable<Array<TaskModel>> {

    return from(this.dbService.taskItems.toArray());
  }

  getTaskById(id: string): Observable<TaskModel | undefined> {
    return from(this.dbService.taskItems.get(+id));
  }

  getTasksPaginator(config: TableConfigModel): Observable<TaskPageModel> {
    return from(this.dbService.taskItems.toArray()).pipe(map(tasks => ({tasks, total: tasks.length})));
  }

  getTaskByProjectId(id: string, config: TableConfigModel): Observable<TaskPageModel> {
    return from(this.dbService.taskItems.toArray())
      .pipe(
        map(tasks => ({total: 10, tasks:tasks.filter((t) => (t.projectId === id))})));
  }

  postTask(body: TaskModel): Observable<void | TaskModel> {
    return from(this.dbService.taskItems.add(body)).pipe(
      switchMap((v) => from(this.dbService.taskItems.get(v)))
    );
  };

  putTask(body: TaskModel): Observable<any> {
    return from(this.dbService.taskItems.put(body));
  };

  deleteTask(id: string): Observable<void> {
    return from(this.dbService.taskItems.delete(+id));
  };
}
