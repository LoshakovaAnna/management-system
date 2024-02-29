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

import {EMPLOYEE_SERVICE, SpinnerService,} from '@core/services';
import {ConfirmWindowDataModel, EmployeeModel, DEFAULT_TABLE_CONFIG, TableConfigModel} from '@core/models';
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
  totalAmount: number = 0;
  displayedColumns: string[] = ['lastName', 'name', 'patronymic', 'title'];

  constructor(private router: Router,
              public dialog: MatDialog,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.onChangePageConfig(DEFAULT_TABLE_CONFIG);
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
        tap(() => this.spinnerService.showSpinner()),
        switchMap(result => (!!result && !!employee.id
            && this.employeeService.deleteEmployee(employee.id)
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
      })
      .add(() => {
        this.spinnerService.hideSpinner();
      });
  }

  onChangePageConfig(config: TableConfigModel) {
    this.spinnerService.showSpinner();
    this.employeeService.getEmployeesPaginator(config)
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.totalAmount = data.total;
          this.employees = data.employees;
          this.cdRef.markForCheck();
          this.spinnerService.hideSpinner();
        },
        error: () => {
          this.spinnerService.hideSpinner();
        }
      });
  }

}
