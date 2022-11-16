import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSelectionComponent } from './ticket-selection.component';

describe('TicketSelectionComponent', () => {
  let component: TicketSelectionComponent;
  let fixture: ComponentFixture<TicketSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
