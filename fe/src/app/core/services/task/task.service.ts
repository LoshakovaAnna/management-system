import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {TaskModel} from '@core/models';
import {environment} from '@env/environment';
import {TaskServiceModel} from './task.service.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceModel {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<Array<TaskModel>> {
    return this.http.get<TaskModel[]>(`${this.url}/api/v1/tasks`);
  }

  getTaskById(id: number): Observable<TaskModel | undefined> {
    return this.http.get<TaskModel>(`${this.url}/api/v1/tasks/${id}`);
  }

  postTask(body: TaskModel): Observable<void | TaskModel>{
    return this.http.post<TaskModel>(`${this.url}/api/v1/tasks`, body);
  }

  putTask(body: TaskModel): Observable<void>{
    return this.http.put<void>(`${this.url}/api/v1/tasks/${body.id}`, body);
  }

  deleteTask(id: string): Observable<void>{
    return this.http.delete<void>(`${this.url}/api/v1/tasks/${id}`);
  }
}
