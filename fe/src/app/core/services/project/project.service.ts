import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ProjectServiceModel} from '@core/services';
import {environment} from '@env/environment';
import {ProjectModel, ProjectPageModel, TableConfigModel} from "@core/models";

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements ProjectServiceModel{
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Array<ProjectModel>>{
    return this.http.get<ProjectModel[]>(`${this.url}/api/v1/projects`);
  }

  getProjectsPaginator(config: TableConfigModel):Observable<ProjectPageModel>{
    let params = `page=${config.pageIndex}&limit=${config.pageSize}`;
    params +=`&sort=${config.sortField}&sortDirection=${config.sortDirection}`;
    return this.http.get<ProjectPageModel>(`${this.url}/api/v1/projects?${params}`);
  }
  getProjectById(id: string): Observable<ProjectModel>{
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
