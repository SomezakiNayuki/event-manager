import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../models/event.model';

@Component({
  selector: 'em-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() public event: Event;
  @Input() public isDetail: boolean;

  constructor() { }

  public ngOnInit(): void {
  }

}
