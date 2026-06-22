import { Injectable, signal } from '@angular/core';
import { MOCK_FLIGHTS } from '../example-data/mock-flight-data';
import { Flight } from '../model/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  flights = signal<Flight[]>(MOCK_FLIGHTS);

  // to get flights this can be replaced by getting data from api
  getFlights() {
    return this.flights;
  }
  // method to refresh flights
  refreshFlights() {
    this.flights.set([...MOCK_FLIGHTS]);
  }
}
