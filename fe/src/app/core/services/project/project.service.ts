import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ProjectServiceModel} from '@core/services';
import {ProjectModel} from '@models/project.model';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements ProjectServiceModel{
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Array<ProjectModel>>{
    return this.http.get<ProjectModel[]>(`${this.url}/api/v1/projects`);
  }
  getProjectById(id: number): Observable<ProjectModel>{
    return this.http.get<ProjectModel>(`${this.url}/api/v1/projects/${id}`);
  }

  postProject(body: ProjectModel): Observable<void | ProjectModel>{
    return this.http.post<ProjectModel>(`${this.url}/api/v1/projects`, body);
  }
  putProject(body: ProjectModel): Observable<void>{
    return this.http.put<void>(`${this.url}/api/v1/projects/${body.id}`, body);
  }

  deleteProject(id: string): Observable<void>{
    return this.http.delete<void>(`${this.url}/api/v1/projects/${id}`);
  }
}
