import {AfterViewInit, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

import {EMPLOYEE_SERVICE, NotificationService,} from '@core/services';
import {ConfirmWindowDataModel, EmployeeModel} from '@core/models';
import {ConfirmWindowComponent} from '@shared/modules/confirm-window/confirm-window.component';
import {UrlPageEnum} from '@core/enums';

@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit {

  destroyRef = inject(DestroyRef);
  employeeService = inject(EMPLOYEE_SERVICE);

  employees!: EmployeeModel[];
  displayedColumns: string[] = ['id', 'lastName', 'name', 'patronymic', 'title'];

  constructor(private router: Router,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.employeeService.getEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: load employee list is failed!');
        },
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
        },
        error: () => {
          this.notificationService.showErrorNotification('Error: delete employee is failed!');
        }
      });
  }

}
