import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private isShowSpinnerBS = new BehaviorSubject<boolean>(false);

  constructor() { }
  showSpinner() {
    this.isShowSpinnerBS.next(true);
  }

  hideSpinner() {
    this.isShowSpinnerBS.next(false);
  }
  getSpinnerStatus(): BehaviorSubject<boolean> {
    return this.isShowSpinnerBS;
  }
}
