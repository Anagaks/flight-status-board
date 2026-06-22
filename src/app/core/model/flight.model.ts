export type FlightStatus = 'On Time' | 'Delayed' | 'Cancelled';

export interface Flight {
    origin: string;
    destination: string;
    arrivalTime: string;
    status: FlightStatus;
}