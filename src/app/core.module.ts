import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {PROJECT_SERVICE, ProjectService} from '@core/services';


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

      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
