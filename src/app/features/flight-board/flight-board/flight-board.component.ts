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
  MatButtonModule
  ],
  templateUrl: './flight-board.component.html'
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
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

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

    if (this.statusFilter() !== 'all') {
      data = data.filter(
        flight => flight.status === this.statusFilter().toLowerCase()
      );
    }

    if (this.destinationFilter()) {
      data = data.filter(
        flight =>
          flight.destination
            .toLowerCase()
            .includes(this.destinationFilter().toLowerCase())
      );
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