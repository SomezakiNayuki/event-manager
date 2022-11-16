import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'em-event-type-icon',
  templateUrl: './event-type-icon.component.html',
  styleUrls: ['./event-type-icon.component.css']
})
export class EventTypeIconComponent implements OnInit {

  @Input() public type: String;

  constructor() { }

  ngOnInit(): void {
  }

}
