import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../models/event.model';

@Component({
  selector: 'em-event-detail-host',
  templateUrl: './event-detail-host.component.html',
  styleUrls: ['./event-detail-host.component.css']
})
export class EventDetailHostComponent implements OnInit {

  @Input() public event: Event;
  @Input() public isDetail: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
