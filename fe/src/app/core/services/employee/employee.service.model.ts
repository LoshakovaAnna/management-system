import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {EmployeeModel, EmployeePageModel, TableConfigModel} from '@core/models';

export const EMPLOYEE_SERVICE = new InjectionToken<EmployeeServiceModel>('employee-service');


export interface EmployeeServiceModel {

  getEmployees(): Observable<Array<EmployeeModel>>;
  getEmployeeById(id: string): Observable<EmployeeModel | undefined>;
  getEmployeesPaginator(config: TableConfigModel): Observable<EmployeePageModel>;

  postEmployee(body: EmployeeModel): Observable<void | EmployeeModel>;
  putEmployee(body: EmployeeModel): Observable<void>;

  deleteEmployee(id: string): Observable<void>;
}
