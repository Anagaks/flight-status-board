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
});

