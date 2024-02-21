import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {EmployeeModel} from '@core/models';

export const EMPLOYEE_SERVICE = new InjectionToken<EmployeeServiceModel>('employee-service');


export interface EmployeeServiceModel {

  getEmployees(): Observable<Array<EmployeeModel>>;
  getEmployeeById(id: string): Observable<EmployeeModel | undefined>;

  postEmployee(body: EmployeeModel): Observable<void | EmployeeModel>;
  putEmployee(body: EmployeeModel): Observable<void>;

  deleteEmployee(id: string): Observable<void>;
}
