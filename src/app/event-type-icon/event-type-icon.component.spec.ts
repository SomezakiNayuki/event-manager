import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeIconComponent } from './event-type-icon.component';

describe('EventTypeIconComponent', () => {
  let component: EventTypeIconComponent;
  let fixture: ComponentFixture<EventTypeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTypeIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
