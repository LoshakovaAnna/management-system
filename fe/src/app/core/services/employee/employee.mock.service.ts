import {Injectable} from '@angular/core';
import {from, interval, map, Observable, switchMap, take} from 'rxjs';

import {DatabaseService, EmployeeServiceModel} from '@core/services';
import {EmployeeModel, EmployeePageModel, TableConfigModel} from '@core/models';

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

  getEmployeeById(id: string): Observable<EmployeeModel | undefined> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.get(+id)))
      );
  };
  getEmployeesPaginator(config: TableConfigModel): Observable<EmployeePageModel>{
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.toArray())),
        map((employees)=>({
          employees: employees.slice(config.pageIndex*config.pageSize, config.pageSize),
          total:employees.length
        })));  }

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

  deleteEmployee(id: string): Observable<void> {
    return interval(this.intervalMl)
      .pipe(
        take(1),
        switchMap(() => from(this.dbService.employeeItems.delete(+id)))
      );
  };
}
