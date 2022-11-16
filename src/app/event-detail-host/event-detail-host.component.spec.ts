import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailHostComponent } from './event-detail-host.component';

describe('EventDetailHostComponent', () => {
  let component: EventDetailHostComponent;
  let fixture: ComponentFixture<EventDetailHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDetailHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
