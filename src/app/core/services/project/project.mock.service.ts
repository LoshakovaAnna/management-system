import {Injectable} from '@angular/core';
import {from, Observable, switchMap} from 'rxjs';

import {DatabaseService, ProjectServiceModel} from '@core/services';
import {ProjectModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectMockService implements ProjectServiceModel {

  constructor(private dbService: DatabaseService) {
  }

  getProjects(): Observable<Array<ProjectModel>> {
    return from(this.dbService.projectItems.toArray());
    // return of(PROJECTS_MOCK);
  };

  getProjectById(id: number): Observable<ProjectModel | undefined> {
    return from(this.dbService.projectItems.get(id));
  };


  postProject(body: ProjectModel): Observable<void | ProjectModel | undefined> {
    return from(this.dbService.projectItems.add(body)).pipe(
      switchMap((v) => from(this.dbService.projectItems.get(v)))
    );
  };

  putProject(body: ProjectModel): Observable<any> {
    return from(this.dbService.projectItems.put(body));
  };

  deleteProject(id: number): Observable<void> {
    return from(this.dbService.projectItems.delete(id));
  };
}
