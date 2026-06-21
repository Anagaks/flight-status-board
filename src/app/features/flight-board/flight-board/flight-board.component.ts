import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Flight } from '../../../core/model/flight.model';
import { MOCK_FLIGHTS } from '../../../core/example-data/mock-flight-data';
import { FlightService } from '../../../core/services/flight.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { interval } from 'rxjs/internal/observable/interval';
import { Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';



@Component({
  selector: 'app-flight-board',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule
  ],
  templateUrl: './flight-board.component.html',
  styleUrl: './flight-board.component.css'
})
export class FlightBoardComponent {

  displayedColumns = [
    'origin',
    'destination',
    'arrivalTime',
    'status'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Flight>(MOCK_FLIGHTS);



  // Signal for flight data
  flights = signal<Flight[]>(MOCK_FLIGHTS);

  flightService = inject(FlightService);

  // Signal for destination search
  destinationFilter = signal('');

  // Signal for status filter
  statusFilter = signal('all');
  _liveAnnouncer: any;


  private refreshSub?: Subscription;

ngOnInit() {
  this.refreshSub = interval(10000).subscribe(() => {
    this.flightService.refreshFlights();
  });
}

ngOnDestroy() {
  this.refreshSub?.unsubscribe();
}

 ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 }
    /** Announce the change in sort state for assistive technology. */
 announceSortChange(sort: Sort) {
  console.log('Sort Event:', sort);
  this.sortActive.set(sort.active);
  this.sortDirection.set(sort.direction);
}

  sortActive = signal('');
sortDirection = signal<'asc' | 'desc' | ''>('');

  // Computed signal


  pageSize = signal(5);
pageIndex = signal(0);

pagedFlights = computed(() => {
  const data = this.filteredFlights();

  const start = this.pageIndex() * this.pageSize();

  return data.slice(start, start + this.pageSize());
});
    filteredFlights = computed(() => {

    let data = [...this.flights()];

    // filter by status
    if (this.statusFilter() !== 'all') {
      data = data.filter(
        flight => flight.status === this.statusFilter().toLowerCase()
      );
    }

    // filter by destination
    if (this.destinationFilter()) {
      data = data.filter(
        flight =>
          flight.destination
            .toLowerCase()
            .includes(this.destinationFilter().toLowerCase())
      );
    }

    // sorting 
    const active = this.sortActive();
  const direction = this.sortDirection();

  if (active && direction) {
    data.sort((a: any, b: any) => {
      const valueA = a[active];
      const valueB = b[active];

      const result =
        valueA < valueB ? -1 :
        valueA > valueB ? 1 : 0;

      return direction === 'asc' ? result : -result;
    });
  }
      return data;

  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.destinationFilter.set(value);
  }

  onStatusChange(value: string) {
    this.statusFilter.set(value);
  }

  onPageChange(event: PageEvent) {
  this.pageIndex.set(event.pageIndex);
  this.pageSize.set(event.pageSize);
}

}