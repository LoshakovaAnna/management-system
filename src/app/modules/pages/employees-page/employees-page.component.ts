import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {first, of, switchMap, tap} from 'rxjs';

import {EMPLOYEE_SERVICE, NotificationService, SpinnerService,} from '@core/services';
import {ConfirmWindowDataModel, EmployeeModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';
import {UrlPageEnum} from '@core/enums';

@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  employeeService = inject(EMPLOYEE_SERVICE);
  spinnerService = inject(SpinnerService);

  employees!: EmployeeModel[];
  displayedColumns: string[] = ['id', 'lastName', 'name', 'patronymic', 'title'];

  constructor(private router: Router,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.spinnerService.showSpinner();
    this.employeeService.getEmployees()
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.cdRef.markForCheck();
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: load employee list is failed!');
        },
        complete: () => {
          this.spinnerService.hideSpinner();
        }
      });
  }

  onAddEmployee() {
    this.router
      .navigateByUrl(`${UrlPageEnum.employees}/${UrlPageEnum.manageEmployee}`);
  }

  onEditEmployee(employee: EmployeeModel) {
    this.router
      .navigateByUrl(`${UrlPageEnum.employees}/${UrlPageEnum.manageEmployee}`, {
        state: {isNewEmployee: false, employee}
      });
  }

  onDeleteEmployee(employee: EmployeeModel) {
    const dialogRef = this.dialog.open(ConfirmWindowComponent, {
      data: {
        title: 'Confirm',
        text: `Are you really want to delete '${employee.lastName} ${employee.name} ${employee.patronymic}' employee?`,
        acceptBtnLabel: 'Yes',
        declineBtnLabel: 'No'
      } as ConfirmWindowDataModel,
    });

    dialogRef.afterClosed()
      .pipe(
        tap(()=> this.spinnerService.showSpinner()),
        switchMap(result => (!!result && !!employee.id
            && this.employeeService.deleteEmployee(+employee.id)
            || of(false)
          )
        ),
        takeUntilDestroyed(this.destroyRef),)
      .subscribe({
        next: (res) => {
          if (res === false) {
            return;
          }
          const index = this.employees.indexOf(employee);
          this.employees.splice(index, 1);
          this.employees = [...this.employees];
          this.cdRef.markForCheck();
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete employee is failed!');
        },
        complete: () => this.spinnerService.hideSpinner()
      });
  }

}
