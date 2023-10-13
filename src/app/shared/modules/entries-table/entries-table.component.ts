import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';

import {TaskModel} from '@core/models';

@Component({
  selector: 'app-entries-table',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './entries-table.component.html',
  styleUrls: ['./entries-table.component.scss']
})
export class EntriesTableComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TaskModel>;

  @Input() displayedColumns: string[] = [];
  @Input() entries: any[] = [];
  @Input() entryName: string = 'Entry';

  @Output() addEntry = new EventEmitter();
  @Output() deleteEntry = new EventEmitter();
  @Output() editEntry = new EventEmitter();


  extraDisplayedColumns: string[] = [];
  dataSource: MatTableDataSource<TaskModel> = new MatTableDataSource([] as TaskModel[]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['entries'] && !!changes['entries'].currentValue) {
      this.dataSource = new MatTableDataSource(changes['entries'].currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if (changes && changes['displayedColumns'] && !!changes['displayedColumns'].currentValue) {
      this.extraDisplayedColumns = [...changes['displayedColumns'].currentValue, 'action'];

    }
  }

  constructor() {
  }

  ngAfterViewInit(): void {
    // this.dataSource = new MatTableDataSource(this.entries);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  onAddTask() {
    this.addEntry.emit();
  }

  onDeleteEntry(row: any) {
    this.deleteEntry.emit(row);
  }

  onEditEntry(row: any) {
    this.editEntry.emit(row);
  }
}
