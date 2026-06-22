import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightBoardComponent } from './flight-board.component';

declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

describe('FlightBoardComponent', () => {
  let component: FlightBoardComponent;
  let fixture: ComponentFixture<FlightBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set origin filter and reset page index on origin search', () => {
    const event = { target: { value: 'Chicago' } } as unknown as Event;
    component.pageIndex.set(5);
    component.onOriginSearch(event);
    expect(component.originFilter()).toBe('Chicago');
    expect(component.pageIndex()).toBe(0);
  });

  it('should set destination filter and reset page index on destination search', () => {
    const event = { target: { value: 'Paris' } } as unknown as Event;
    component.pageIndex.set(2);
    component.onDestinationSearch(event);
    expect(component.destinationFilter()).toBe('Paris');
    expect(component.pageIndex()).toBe(0);
  });

  it('should change status filter via onStatusChange and reset page index', () => {
    component.pageIndex.set(3);
    component.onStatusChange('delayed');
    expect(component.statusFilter()).toBe('delayed');
    expect(component.pageIndex()).toBe(0);
  });

  it('should return correct status classes', () => {
    expect(component.getStatusClass('On Time')).toBe('status-on-time');
    expect(component.getStatusClass('Delayed')).toBe('status-delayed');
    expect(component.getStatusClass('Cancelled')).toBe('status-cancelled');
    expect(component.getStatusClass('Something Else')).toBe('');
  });

  it('should filter flights by status, origin and destination', () => {
    component.flights.set([
      { origin: 'A', destination: 'X', arrivalTime: '01:00', status: 'On Time' },
      { origin: 'B', destination: 'Y', arrivalTime: '02:00', status: 'Delayed' },
      { origin: 'C', destination: 'Z', arrivalTime: '03:00', status: 'On Time' },
    ] as any);

    component.statusFilter.set('On Time');
    expect(component.filteredFlights().length).toBe(2);

    component.originFilter.set('B');
    expect(component.filteredFlights().length).toBe(0);

    component.originFilter.set('');
    component.destinationFilter.set('Z');
    expect(component.filteredFlights().length).toBe(1);
  });

  it('should sort flights when sortActive and sortDirection are set', () => {
    component.flights.set([
      { origin: 'B', destination: 'X', arrivalTime: '01:00', status: 'On Time' },
      { origin: 'A', destination: 'Y', arrivalTime: '02:00', status: 'On Time' },
    ] as any);

    component.sortActive.set('origin');
    component.sortDirection.set('asc');
    const sorted = component.filteredFlights();
    expect(sorted[0].origin).toBe('A');

    component.sortDirection.set('desc');
    const sortedDesc = component.filteredFlights();
    expect(sortedDesc[0].origin).toBe('B');
  });

  it('should paginate results via pagedFlights', () => {
    component.flights.set([
      { origin: '1', destination: 'X', arrivalTime: '01:00', status: 'On Time' },
      { origin: '2', destination: 'Y', arrivalTime: '02:00', status: 'On Time' },
      { origin: '3', destination: 'Z', arrivalTime: '03:00', status: 'On Time' },
    ] as any);

    component.pageSize.set(1);
    component.pageIndex.set(1);
    const page = component.pagedFlights();
    expect(page.length).toBe(1);
    expect(page[0].origin).toBe('2');
  });

  it('should update pageIndex and pageSize on onPageChange', () => {
    const event: any = { pageIndex: 2, pageSize: 10 };
    component.onPageChange(event);
    expect(component.pageIndex()).toBe(2);
    expect(component.pageSize()).toBe(10);
  });

  it('should update sort signals on announceSortChange', () => {
    component.announceSortChange({ active: 'origin', direction: 'desc' } as any);
    expect(component.sortActive()).toBe('origin');
    expect(component.sortDirection()).toBe('desc');
  });

  it('should create an interval subscription on ngOnInit and unsubscribe on ngOnDestroy', () => {
    // ensure no subscription initially
    expect((component as any).refreshSub).toBeUndefined();
    component.ngOnInit();
    expect((component as any).refreshSub).toBeDefined();
    const sub = (component as any).refreshSub;
    expect(sub.closed).toBeFalse();
    component.ngOnDestroy();
    expect(sub.closed).toBeTrue();
  });
});
