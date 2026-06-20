import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlightBoardComponent } from './features/flight-board/flight-board/flight-board.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FlightBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('flight_status_board');
}
