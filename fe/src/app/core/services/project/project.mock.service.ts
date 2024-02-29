import {Injectable} from '@angular/core';
import {from, interval, Observable, of, switchMap, take} from 'rxjs';

import {DatabaseService, ProjectServiceModel} from '@core/services';
import {ProjectModel, ProjectPageModel, TableConfigModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectMockService implements ProjectServiceModel {

  constructor(private dbService: DatabaseService) {
  }

  getProjects(): Observable<Array<ProjectModel>> {
    return interval(1000)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.projectItems.toArray()))
      );
  };

  getProjectById(id: string): Observable<ProjectModel | undefined> {
    return from(this.dbService.projectItems.get(+id));
  };


  getProjectsPaginator(config: TableConfigModel):Observable<ProjectPageModel> {
    return interval(1000)
      .pipe(
        take(1),
        switchMap(() => of({projects:[], total:0}))
      );
  }
  postProject(body: ProjectModel): Observable<void | ProjectModel | undefined> {
    return from(this.dbService.projectItems.add(body)).pipe(
      switchMap((v) => from(this.dbService.projectItems.get(v)))
    );
  };

  putProject(body: ProjectModel): Observable<any> {
    return from(this.dbService.projectItems.put(body));
  };

  deleteProject(id: string): Observable<void> {
    return from(this.dbService.projectItems.delete(+id));
  };
}
