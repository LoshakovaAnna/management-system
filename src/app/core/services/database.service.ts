import Dexie, {Table} from 'dexie';
import {Injectable} from '@angular/core';

import {ProjectModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {

  projectItems!: Table<ProjectModel, number>;

  constructor() {
    super('projectsDB');
    this.version(1).stores({
      projectItems: '++id',
    });
  }


}
