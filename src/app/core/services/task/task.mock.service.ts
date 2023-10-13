import {Injectable} from '@angular/core';
import {from, Observable, switchMap} from 'rxjs';

import {TaskServiceModel} from './task.service.model';
import {TaskFullModel, TaskModel} from '@core/models';
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

  getTaskById(id: number): Observable<TaskModel | undefined> {

    return from(this.dbService.taskItems.get(id));
  }

  postTask(body: TaskFullModel): Observable<void | TaskModel> {
    return from(this.dbService.taskItems.add(body)).pipe(
      switchMap((v) => from(this.dbService.taskItems.get(v)))
    );
  };

  putTask(body: TaskFullModel): Observable<any> {
    return from(this.dbService.taskItems.put(body));
  };

  deleteTask(id: number): Observable<void> {
    return from(this.dbService.taskItems.delete(id));
  };
}
