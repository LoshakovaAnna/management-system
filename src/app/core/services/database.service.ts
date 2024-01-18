import Dexie, {Table} from 'dexie';
import {Injectable} from '@angular/core';

import {EmployeeModel, ProjectModel, TaskModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {

  projectItems!: Table<ProjectModel, number>;
  taskItems!: Table<TaskModel, number>;
  employeeItems!: Table<EmployeeModel, number>;

  constructor() {
    super('projectsDB');
    this.version(5).stores({
      projectItems: '++id',
      taskItems:  '++id',
      employeeItems:  '++id',
    });
  }


}
