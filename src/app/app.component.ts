import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {SpinnerService} from '@core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  spinnerService = inject(SpinnerService);
  isShowSpinner$ = this.spinnerService.getSpinnerStatus();
  title = 'management-system';
}
