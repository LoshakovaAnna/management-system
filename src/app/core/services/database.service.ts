import Dexie, {Table} from 'dexie';
import {Injectable} from '@angular/core';

import {ProjectModel, TaskModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {

  projectItems!: Table<ProjectModel, number>;
  taskItems!: Table<TaskModel, number>;

  constructor() {
    super('projectsDB');
    this.version(2).stores({
      projectItems: '++id',
      taskItems:  '++id',
    });
  }


}
