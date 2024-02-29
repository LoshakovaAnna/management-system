import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {ProjectModel, ProjectPageModel, TableConfigModel} from '@core/models';

export const PROJECT_SERVICE = new InjectionToken<ProjectServiceModel>('project-service');


export interface ProjectServiceModel {

  getProjects(): Observable<Array<ProjectModel>>;
  getProjectById(id: string): Observable<ProjectModel | undefined>;
  getProjectsPaginator(config: TableConfigModel):Observable<ProjectPageModel>;

  postProject(body: ProjectModel): Observable<void | ProjectModel>;
  putProject(body: ProjectModel): Observable<void>;

  deleteProject(id: string): Observable<void>;
}
