import {InjectionToken} from "@angular/core";
import {ProjectModel} from "@models/project.model";
import {Observable} from "rxjs";

export const PROJECT_SERVICE = new InjectionToken<ProjectServiceModel>('project-service');


export interface ProjectServiceModel {

  getProjects(): Observable<Array<ProjectModel>>;
  getProjectById(id: number): Observable<ProjectModel | undefined>;

  postProject(body: ProjectModel): Observable<void | ProjectModel>;
  putProject(body: ProjectModel): Observable<void>;

  deleteProject(id: number): Observable<void>;
}