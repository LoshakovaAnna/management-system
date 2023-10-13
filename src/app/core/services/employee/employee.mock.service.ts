import {Injectable} from '@angular/core';
import {from, Observable, switchMap} from 'rxjs';

import {DatabaseService, } from '@core/services';
import {EmployeeModel} from '@core/models';
import {EmployeeServiceModel} from './employee.service.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMockService implements EmployeeServiceModel {

  constructor(private dbService: DatabaseService) {
  }

  getEmployees(): Observable<Array<EmployeeModel>> {
    return from(this.dbService.employeeItems.toArray());
  };

  getEmployeeById(id: number): Observable<EmployeeModel | undefined> {
    return from(this.dbService.employeeItems.get(id));
  };


  postEmployee(body: EmployeeModel): Observable<void | EmployeeModel | undefined> {
    return from(this.dbService.employeeItems.add(body)).pipe(
      switchMap((v) => from(this.dbService.employeeItems.get(v)))
    );
  };

  putEmployee(body: EmployeeModel): Observable<any> {
    return from(this.dbService.employeeItems.put(body));
  };

  deleteEmployee(id: number): Observable<void> {
    return from(this.dbService.employeeItems.delete(id));
  };
}
