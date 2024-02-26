import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

import {TasksPageComponent} from './tasks-page.component';
import {TaskManageComponent} from './task-manage/task-manage.component';
import {FULL_DATE_WITH_DOTES} from '@consts/date.const';
import {EmployeeFullNamePipe} from '@pipes/employee-full-name.pipe';
import {TasksTableComponent, PageTitleComponent} from '@shared/modules';
import {UrlPageEnum} from '@core/enums';

const routes: Routes = [
  {
    path: '',
    component: TasksPageComponent,
  },
  {
    path: UrlPageEnum.manageTask,
    component: TaskManageComponent
  }
];

@NgModule({
  declarations: [
    TasksPageComponent,
    TaskManageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TasksTableComponent,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    EmployeeFullNamePipe,
    PageTitleComponent,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: FULL_DATE_WITH_DOTES},
  ]
})
export class TasksPageModule {
}
