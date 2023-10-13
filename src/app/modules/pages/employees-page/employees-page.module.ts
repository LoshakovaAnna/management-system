import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

import {EmployeesPageComponent} from './employees-page.component';
import {EmployeeManageComponent} from './employee-manage/employee-manage.component';
import {EntriesTableComponent} from '@shared/modules';


const routes: Routes = [
  {
    path: '',
    component: EmployeesPageComponent,
  },
  {
    path: 'manage-employee',
    component: EmployeeManageComponent
  }
];

@NgModule({
  declarations: [
    EmployeesPageComponent,
    EmployeeManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    EntriesTableComponent,
  ]
})
export class EmployeesPageModule {
}
