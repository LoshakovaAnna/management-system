import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {
  EMPLOYEE_SERVICE,
  EmployeeService,
  PROJECT_SERVICE,
  ProjectService,
  TASK_SERVICE,
  TaskService
} from '@core/services';

@NgModule({
  imports: [],
  exports: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModule,
      providers: [
        {provide: PROJECT_SERVICE, useClass: ProjectService},
        {provide: TASK_SERVICE, useClass: TaskService},
        {provide: EMPLOYEE_SERVICE, useClass: EmployeeService},
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
