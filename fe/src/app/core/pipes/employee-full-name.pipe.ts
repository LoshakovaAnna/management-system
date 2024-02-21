import { Pipe, PipeTransform } from '@angular/core';

import {EmployeeModel} from '@core/models';

@Pipe({
  name: 'employeeFullName',
  standalone: true
})
export class EmployeeFullNamePipe implements PipeTransform {

  transform(value: EmployeeModel, ...args: unknown[]): unknown {
    return `${value.lastName} ${value.name} ${value.patronymic}`;
  }

}
