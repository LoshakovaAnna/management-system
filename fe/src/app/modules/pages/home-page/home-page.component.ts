import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageTitleComponent} from '@shared/modules';
import {delay, mapTo, startWith} from 'rxjs/operators';
import {concat, empty, interval, merge, of, timer} from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  @HostListener('window:beforeunload', ['$event'])
  onTabClose(event: any): void {
    // if (this.isSettingsChanged()) {
      event.preventDefault();
      event.returnValue = 'fshoefho';
    // }
  }

  @HostListener('window:unload', ['$event'])
  onBrowserClose(event: any): void {
    // if (this.isSettingsChanged()) {
      event.preventDefault();
      event.returnValue = null;
    // }
  }

  constructor() {

    window.onbeforeunload = function () {
      return 'Are you sure you want to leave?';
    };
    window.onunload = function() {
      alert('Bye.');
    }
  }
}
