import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Flight } from '../../../core/model/flight.model';
import { MOCK_FLIGHTS } from '../../../core/example-data/mock-flight-data';
import { FlightService } from '../../../core/services/flight.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';
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
    MatTabsModule,
  ],
  templateUrl: './flight-board.component.html',
  styleUrls: ['./flight-board.component.css'],
})
export class FlightBoardComponent implements OnInit, OnDestroy {
  displayedColumns = ['origin', 'destination', 'arrivalTime', 'status'];

  // Signal for flight data
  flights = signal<Flight[]>(MOCK_FLIGHTS);
  flightService = inject(FlightService);

  // Signals for filters
  originFilter = signal('');
  destinationFilter = signal('');
  statusFilter = signal('all');

  private refreshSub?: Subscription;

  // Signals for sorting and pagination
  sortActive = signal('');
  sortDirection = signal<'asc' | 'desc' | ''>('');
  pageSize = signal(5); // Default to 5 records
  pageIndex = signal(0);

  // refresh application every 10 min to get live or new status of flight
  ngOnInit() {
    this.refreshSub = interval(10000).subscribe(() => {
      this.flightService.refreshFlights();
    });
  }

  // Sorting
  announceSortChange(sort: Sort) {
    this.sortActive.set(sort.active);
    this.sortDirection.set(sort.direction);
  }

  pagedFlights = computed(() => {
    const data = this.filteredFlights();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  // Handles filtering and sorting
  filteredFlights = computed(() => {
    let data = [...this.flights()];

    if (this.statusFilter() !== 'all') {
      data = data.filter(
        (flight) => flight.status.toLowerCase() === this.statusFilter().toLowerCase(),
      );
    }

    if (this.originFilter()) {
      data = data.filter((flight) =>
        flight.origin.toLowerCase().includes(this.originFilter().toLowerCase()),
      );
    }

    if (this.destinationFilter()) {
      data = data.filter((flight) =>
        flight.destination.toLowerCase().includes(this.destinationFilter().toLowerCase()),
      );
    }

    const active = this.sortActive();
    const direction = this.sortDirection();

    if (active && direction) {
      data.sort((a: any, b: any) => {
        const valueA = a[active];
        const valueB = b[active];
        const result = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return direction === 'asc' ? result : -result;
      });
    }

    return data;
  });

  onOriginSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.originFilter.set(value);
    this.pageIndex.set(0); // Reset to first page on search
  }

  onDestinationSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.destinationFilter.set(value);
    this.pageIndex.set(0); // Reset to first page on search
  }

  onStatusChange(value: string) {
    this.statusFilter.set(value);
    this.pageIndex.set(0); // Reset to first page on search
  }

  // By Considering performance in case of 100 000 flights pagination is implemented to show only 5 records at a time and user can navigate through pages
  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  // filter by status
  getStatusClass(status: string): string {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'on time') return 'status-on-time';
    if (lowerStatus === 'delayed') return 'status-delayed';
    if (lowerStatus === 'cancelled') return 'status-cancelled';
    return '';
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }
}
