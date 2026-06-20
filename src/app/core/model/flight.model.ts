export type FlightStatus = 'on-time' | 'delayed' | 'cancelled';

export interface Flight {
    id: String;
    origin: string;
    destination: string;
    arrivalTime: number;
    status: FlightStatus;
}