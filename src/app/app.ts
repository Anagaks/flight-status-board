import { Component, signal } from '@angular/core';
import { FlightBoardComponent } from './features/flight-board/flight-board/flight-board.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [ FlightBoardComponent ,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('flight_status_board');
}
