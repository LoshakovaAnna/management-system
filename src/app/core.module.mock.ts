import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {
  EMPLOYEE_SERVICE,
  EmployeeMockService,
  PROJECT_SERVICE,
  ProjectMockService,
  TASK_SERVICE,
  TaskMockService
} from '@core/services';


@NgModule({
  imports: [],
  exports: []
})

export class CoreModuleMock {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CoreModuleMock,
      providers: [
        {provide: PROJECT_SERVICE, useClass: ProjectMockService},
        {provide: TASK_SERVICE, useClass: TaskMockService},
        {provide: EMPLOYEE_SERVICE, useClass: EmployeeMockService},
       ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModuleMock) {
    if (parentModule) {
      throw new Error('CoreModuleMock is already loaded. Import it in the AppModule only');
    }
  }
}
