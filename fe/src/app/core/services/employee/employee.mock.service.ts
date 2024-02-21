import {Injectable} from '@angular/core';
import {from, interval, Observable, switchMap, take} from 'rxjs';

import {DatabaseService, EmployeeServiceModel} from '@core/services';
import {EmployeeModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMockService implements EmployeeServiceModel {

  intervalMl = 1000;

  constructor(private dbService: DatabaseService) {
  }

  getEmployees(): Observable<Array<EmployeeModel>> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.toArray())
        ));
  };

  getEmployeeById(id: number): Observable<EmployeeModel | undefined> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.get(id)))
      );
  };


  postEmployee(body: EmployeeModel): Observable<void | EmployeeModel | undefined> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.add(body))),
        switchMap((v) => from(this.dbService.employeeItems.get(v)))
      );
  };

  putEmployee(body: EmployeeModel): Observable<any> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.put(body)))
      );
  };

  deleteEmployee(id: number): Observable<void> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.delete(id)))
      );
  };
}
