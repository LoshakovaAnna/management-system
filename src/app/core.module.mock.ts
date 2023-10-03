import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {PROJECT_SERVICE, ProjectMockService} from '@core/services';


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
       ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModuleMock) {
    if (parentModule) {
      throw new Error('CoreModuleMock is already loaded. Import it in the AppModule only');
    }
  }
}
