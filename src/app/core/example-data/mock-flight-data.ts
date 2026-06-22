import { Flight } from '../model/flight.model';

export const MOCK_FLIGHTS: Flight[] = [
  {
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    arrivalTime: '06:30',
    status: 'On Time',
  },
  {
    origin: 'Los Angeles (LAX)',
    destination: 'Tokyo (HND)',
    arrivalTime: '14:45',
    status: 'Delayed',
  },
  {
    origin: 'Dubai (DXB)',
    destination: 'Paris (CDG)',
    arrivalTime: '09:15',
    status: 'On Time',
  },
  {
    origin: 'Frankfurt (FRA)',
    destination: 'Singapore (SIN)',
    arrivalTime: '23:50',
    status: 'Cancelled',
  },
  {
    origin: 'Hong Kong (HKG)',
    destination: 'Sydney (SYD)',
    arrivalTime: '18:20',
    status: 'On Time',
  },
  {
    origin: 'Chicago (ORD)',
    destination: 'Toronto (YYZ)',
    arrivalTime: '10:05',
    status: 'Delayed',
  },
  {
    origin: 'Mumbai (BOM)',
    destination: 'New York (EWR)',
    arrivalTime: '04:10',
    status: 'On Time',
  },
  {
    origin: 'Seattle (SEA)',
    destination: 'Amsterdam (AMS)',
    arrivalTime: '11:35',
    status: 'On Time',
  },
  {
    origin: 'Miami (MIA)',
    destination: 'São Paulo (GRU)',
    arrivalTime: '20:15',
    status: 'Delayed',
  },
  {
    origin: 'Sydney (SYD)',
    destination: 'Auckland (AKL)',
    arrivalTime: '15:00',
    status: 'Cancelled',
  },
];
