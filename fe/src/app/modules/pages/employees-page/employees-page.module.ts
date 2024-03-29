import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

import {EmployeesPageComponent} from './employees-page.component';
import {EmployeeManageComponent} from './employee-manage/employee-manage.component';
import {EntriesTableComponent, PageTitleComponent} from '@shared/modules';
import {UrlPageEnum} from '@core/enums';


const routes: Routes = [
  {
    path: '',
    component: EmployeesPageComponent,
  },
  {
    path: UrlPageEnum.manageEmployee,
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
    PageTitleComponent,
  ]
})
export class EmployeesPageModule {
}
