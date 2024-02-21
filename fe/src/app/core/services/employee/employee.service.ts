import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '@env/environment';
import {EmployeeServiceModel} from './employee.service.model';
import {EmployeeModel} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements EmployeeServiceModel{
  private url: string = environment.apiUrl ;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Array<EmployeeModel>>{
    return this.http.get<EmployeeModel[]>(`${this.url}/api/v1/employees`);
  }
  getEmployeeById(id: string): Observable<EmployeeModel>{
    return this.http.get<EmployeeModel>(`${this.url}/api/v1/employees/${id}`);
  }

  postEmployee(body: EmployeeModel): Observable<void | EmployeeModel>{
    return this.http.post<EmployeeModel>(`${this.url}/api/v1/employees`, body);
  }
  putEmployee(body: EmployeeModel): Observable<void>{
    return this.http.put<void>(`${this.url}/api/v1/employees/${body.id}`, body);
  }

  deleteEmployee(id: string): Observable<void>{
    return this.http.delete<void>(`${this.url}/api/v1/employees/${id}`);
  }
}
