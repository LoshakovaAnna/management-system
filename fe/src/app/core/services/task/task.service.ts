import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {TableConfigModel, TaskModel, TaskPageModel} from '@core/models';
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
  getTasksPaginator(config: TableConfigModel): Observable<TaskPageModel> {
    let params = `page=${config.pageIndex}&limit=${config.pageSize}`;
    params +=`&sort=${config.sortField}&sortDirection=${config.sortDirection}`;
    return this.http.get<TaskPageModel>(`${this.url}/api/v1/tasks?${params}`);}

  getTaskById(id: string): Observable<TaskModel | undefined> {
    return this.http.get<TaskModel>(`${this.url}/api/v1/tasks/${id}`);
  }
  getTaskByProjectId(projectId: string, config: TableConfigModel): Observable<TaskPageModel> {
    let params = `page=${config.pageIndex}&limit=${config.pageSize}`;
    params +=`&sort=${config.sortField}&sortDirection=${config.sortDirection}`;
    return this.http.get<TaskPageModel>(`${this.url}/api/v1/tasks/project/${projectId}?${params}`);
  }

  postTask(body: any): Observable<void | TaskModel>{
    return this.http.post<TaskModel>(`${this.url}/api/v1/tasks`, body);
  }

  putTask(body: TaskModel): Observable<void>{
    return this.http.put<void>(`${this.url}/api/v1/tasks/${body.id}`, body);
  }

  deleteTask(id: string): Observable<void>{
    return this.http.delete<void>(`${this.url}/api/v1/tasks/${id}`);
  }
}
